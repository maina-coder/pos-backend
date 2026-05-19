from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, TodaySalesView, ItemAutocompleteView

# The DefaultRouter automatically creates standard links for creating, viewing, and deleting sales
router = DefaultRouter()
router.register(r'sales', SaleViewSet, basename='sales')

urlpatterns = [
    # Connects all your standard sales endpoints (/api/sales/)
    path('', include(router.urls)),
    
    # Connects your live operational scoreboard view (/api/sales/today/)
    path('sales/today/', TodaySalesView.as_view(), name='sales-today'),
    
    # Connects your instant lookup search widget (/api/search/items/)
    path('search/items/', ItemAutocompleteView.as_view(), name='search-items'),
]