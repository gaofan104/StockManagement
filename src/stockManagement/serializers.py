from rest_framework import serializers
from .models import Item
from .models import Order
from django.contrib.auth.models import User

class itemDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ('id', 'name', 'price', 'quantity', 'image', 'type', 'updated')

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class orderSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    buyer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    item_details = itemDetailsSerializer(source='item', required=False)
    buyer_details = userSerializer(source='buyer', required=False)

    class Meta:
        model = Order
        fields = ('id', 'item', 'buyer', 'quantity', 'phone', 'address', 'updated', 'item_details', 'buyer_details',
                  'status', 'deliveryman')

class orderListSerializer(serializers.ListSerializer):
    child = orderSerializer()

    def update(self, instance, validated_data):
        # Maps for id->instance and id->data item.
        order_mapping = {order.id: order for order in instance}
        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for order_id, data in data_mapping.items():
            order = order_mapping.get(order_id, None)
            if order is None:
                # this will not work since create is not overridden in orderSerializer
                # orderSerializer is expecting Order.item to be instance, but it is a primary key only
                ret.append(self.child.create(data))
            else:
                # the below will not work since update is not overridden in orderSerializer
                # orderSerializer is expecting Order.item to be instance, but it is a primary key only
                # ret.append(self.child.update(order, data))
                updated_order = orderSerializer(order, data=data)
                if updated_order.is_valid():
                    ret.append(updated_order.save())
        return ret

    class Meta:
        model = Order
        fields = ('id', 'item', 'buyer', 'quantity', 'phone', 'address', 'updated',
                  'status')
