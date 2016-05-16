# Created By: Allen Gao
# Date Created: 2016/03/12
# Description: stockManagement Project URL settings
# Notes:
# 1.

from django.conf import settings
from django.conf.urls import include, url, patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from .views import OrderFormView, OrderList, OrderListUpdate, FileUploadView, UserList

orders_urls = patterns('',
    url(r'^$', OrderList.as_view(), name='order-list'),
    url(r'^update', 'stockManagement.views.OrderListUpdate', name='order-list-update'),
)

users_urls = patterns('',
    url(r'^$', UserList.as_view(), name='user-list'),
)

urlpatterns = [
    url(r'^$', 'stockManagement.views.main', name='smMain'),
    url(r'api/items', 'stockManagement.views.ItemDetails'),
    url(r'^order_form/(?P<item_id>[0-9]+)/(?P<order_id>[0-9]+)', OrderFormView.as_view()),
    url(r'^order_form/(?P<item_id>[0-9]+)', OrderFormView.as_view()),
    url(r'^orders/', include(orders_urls)),
    url(r'^files/', FileUploadView.as_view()),
    url(r'^users/', include(users_urls)),
]