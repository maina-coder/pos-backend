from rest_framework import serializers
from django.db import transaction
from .models import Sale, SaleItem

class SaleItemSerializer(serializers.ModelSerializer):
    """
    Translates individual shopping cart items between JSON and the database.
    """
    class Meta:
        model = SaleItem
        fields = ['id', 'name', 'price', 'quantity', 'subtotal']
        read_only_fields = ['subtotal']  # Remember, our database calculates this automatically!


class SaleSerializer(serializers.ModelSerializer):
    """
    Handles the master receipt data and runs the core transaction checkout logic.
    """
    # Nesting the items serializer inside ensures we can read/write multiple items in a single request
    items = SaleItemSerializer(many=True)
    cashier_name = serializers.ReadOnlyField(source='cashier.username')

    class Meta:
        model = Sale
        fields = ['id', 'cashier_name', 'timestamp', 'total_amount', 'amount_received', 'balance', 'items']
        read_only_fields = ['total_amount', 'balance', 'timestamp']

    def create(self, validated_data):
        """
        Intercepts incoming POST data, runs POS calculations, and commits records.
        """
        # 1. Pull the raw shopping cart array data away from the main receipt wrapper
        items_data = validated_data.pop('items')
        
        # 2. Automatically compute the true checkout total from the item data
        total_amount = sum(item['price'] * item['quantity'] for item in items_data)
        amount_received = validated_data['amount_received']
        
        # 3. Guard clause: Ensure the customer provided enough cash to cover the transaction
        if amount_received < total_amount:
            raise serializers.ValidationError(
                {"amount_received": f"Insufficient cash provided. Total is {total_amount}, but only received {amount_received}."}
            )
            
        balance = amount_received - total_amount

        # 4. Use an Atomic Transaction to guarantee total database integrity
        with transaction.atomic():
            # Automatically fetch the logged-in user making this API request
            request = self.context.get('request')
            cashier = request.user if request and request.user.is_authenticated else None

            # Create the master Sale row record
            sale = Sale.objects.create(
                cashier=cashier,
                total_amount=total_amount,
                balance=balance,
                **validated_data
            )

            # Create each linked SaleItem line item row inside the database
            for item_data in items_data:
                SaleItem.objects.create(sale=sale, **item_data)
                
        return sale