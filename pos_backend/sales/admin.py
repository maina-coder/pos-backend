from django.contrib import admin
from .models import Sale, SaleItem

# This allows you to view item lines nested directly inside the main receipt layout page
class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    readonly_fields = ['subtotal']  # Handled automatically by our database logic

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    # This defines the visual data columns you see when browsing past transactions
    list_display = ['id', 'cashier', 'timestamp', 'total_amount', 'amount_received', 'balance']
    
    # Adds a handy filter panel on the right sidebar to sort by date or cashier
    list_filter = ['timestamp', 'cashier']
    
    # Injects the shopping cart lines directly inside the master receipt view page
    inlines = [SaleItemInline]