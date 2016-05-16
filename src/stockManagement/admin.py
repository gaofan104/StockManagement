from django.contrib import admin
from .models import Item
from .models import Order

# Register your models here.

class ItemAdmin(admin.ModelAdmin):

	list_display = ["__unicode__", "price", "quantity", "admin_image", "type", "updated"]

readonly_fields = ('admin_image')
admin.site.register(Item, ItemAdmin)


class OrderAdmin(admin.ModelAdmin):

	list_display = ["__unicode__", 'id', 'status', 'item', 'buyer', 'quantity', 'phone', 'address', 'updated']

admin.site.register(Order, OrderAdmin)