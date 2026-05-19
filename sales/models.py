

from django.db import models
from django.contrib.auth.models import User

class Sale(models.Model):
    """
    This table stores the master receipt summary details for every checkout transaction.
    """
    # Links the sale directly to the logged-in User (Cashier or Admin)
    cashier = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales')
    
    # Automatically tracks the exact date and clock time the transaction was closed
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Financial metrics with up to 12 digits total and 2 decimal places (e.g., 9,999,999,999.99)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    amount_received = models.DecimalField(max_digits=12, decimal_places=2)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Sale #{self.id} on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class SaleItem(models.Model):
    """
    This table stores the specific line items tied inside a parent Sale receipt.
    """
    # Connects this item line to its parent Sale receipt. If the sale is deleted, delete these lines too.
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    
    # Snapshot parameters for the item sold
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        """
        Custom execution block: Automatically calculate the line's subtotal 
        before committing the data row to the database.
        """
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.quantity}x)"
