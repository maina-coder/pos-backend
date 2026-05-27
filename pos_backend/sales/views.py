from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Count
from .models import Sale, SaleItem
from .serializers import SaleSerializer

# 🧾 1. CORE TRANSACTION CONTROLLER (POS CHECKOUT & HISTORY)
class SaleViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - POST /api/sales/         -> Process a fresh checkout transaction
    - GET /api/sales/          -> View full sales log (with optional date/cashier filters)
    - GET /api/sales/<id>/     -> Retrieve a single receipt snapshot (for printing/reprints)
    """
    queryset = Sale.objects.all().order_by('-timestamp')
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Dynamically filters sales history based on URL query parameters.
        Example: /api/sales/?date=2026-05-19&cashier=mercy
        """
        queryset = self.queryset
        date_param = self.request.query_params.get('date')
        cashier_param = self.request.query_params.get('cashier')

        if date_param:
            queryset = queryset.filter(timestamp__date=date_param)
        if cashier_param:
            queryset = queryset.filter(cashier__username=cashier_param)
            
        return queryset


# 📊 2. REAL-TIME OPERATIONAL METRICS (TODAY'S TOTALS)
class TodaySalesView(APIView):
    """
    GET /api/sales/today/
    Aggregates metrics for the current day to display on high-priority UI scoreboard widgets.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        
        # High-efficiency database-level math aggregation
        stats = Sale.objects.filter(timestamp__date=today).aggregate(
            revenue=Sum('total_amount'),
            transactions=Count('id')
        )
        
        return Response({
            "total_sales_today": float(stats['revenue'] or 0.00),
            "transactions_today": stats['transactions'] or 0
        })


# 🔍 3. AUTOCOMPLETE / INSTANT SEARCH ENDPOINT
class ItemAutocompleteView(APIView):
    """
    GET /api/search/items/?q=sam
    Returns a distinct list of saved item names matching the query for lightning-fast UI autocomplete.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
            
        # Scan historical line items, extract unique string tags, and cap at 10 results
        items = SaleItem.objects.filter(name__icontains=query)\
            .values_list('name', flat=True)\
            .distinct()[:10]
            
        return Response(list(items))
