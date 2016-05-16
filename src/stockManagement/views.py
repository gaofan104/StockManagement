# -*- coding: utf-8 -*-
from django.shortcuts import render
from .models import Item
from .models import Order
from django.conf import settings
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from rest_framework import routers, serializers, viewsets
from .serializers import itemDetailsSerializer, orderSerializer
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .forms import OrderForm
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseBadRequest
from .serializers import orderSerializer, orderListSerializer, userSerializer
import json
from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.template import Context
from django.core.mail import EmailMultiAlternatives


# Create your views here.
@login_required(login_url='accounts/login')
def main(request):
	if request.user.is_authenticated():
		items = Item.objects.all().order_by('-updated')

		paginator = Paginator(items, 4)

		try: page = int(request.GET.get("page", '1'))
		except ValueError: page = 1

		try:
 			page_images = paginator.page(page)
    		except (InvalidPage, EmptyPage):
        		page_images = paginator.page(paginator.num_pages)

		context = {
			"items" : page_images[:4],
			"media_url" : settings.MEDIA_URL,
			"page_images" : page_images,
            "order_form" : OrderForm(),
            "temp" : "hello"
		}

		return render(request, "stockManagement/html/portal.html", context)


class OrderList(generics.ListCreateAPIView):
    model = Order
    queryset = Order.objects.all().order_by("-updated")
    serializer_class = orderSerializer
    def get_queryset(self):
        queryset = super(OrderList, self).get_queryset()

        if self.request.user.is_staff:
            return queryset.all()
        else:
            return queryset.filter(buyer=self.request.user)

class UserList(generics.ListCreateAPIView):
    model = User
    queryset = User.objects.filter(is_staff=True)
    serializer_class = userSerializer
    def get_queryset(self):
        queryset = super(UserList, self).get_queryset()
        return queryset

def OrderListUpdate(request):
    orders = orderListSerializer(data=json.loads(request.body))
    if orders.is_valid():
        data = orders.update(Order.objects.all(), json.loads(request.body))
        # send email for each order
        # for d in data:
        #     email_subject = 'New Delivery'
        #     ctx = {
        #         'deliveryman': data[0].deliveryman.username,
        #         'item': data[0].item.name,
        #         'quantity': data[0].quantity,
        #         'address': data[0].address,
        #     }
        #     email_content = get_template('stockManagement/html/delivery_email.html').render(Context(ctx))
        #     email_to = [User.objects.filter(id=d.deliveryman.id)[0].email]
        #     email_from = 'gaofan1004@gmail.com'
        #     msg = EmailMultiAlternatives(email_subject, email_content, email_from, email_to)
        #     msg.attach_alternative(email_content, "text/html")
        #     msg.send()

    if len(data) != 0:
        return HttpResponse('successful')
    return HttpResponse('')


@api_view(['GET', 'POST', ])
def ItemDetails(request):
	items = Item.objects.all()
	itemserializer = itemDetailsSerializer(items, many=True)
	return Response(itemserializer.data)


class OrderFormView(TemplateView):

    template_name = 'stockManagement/angular/templates/buy-form-modal.html'

    @csrf_exempt
    def dispatch(self, *args, **kwargs):
        return super(OrderFormView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(OrderFormView, self).get_context_data(**kwargs)
        context.update(order_form=OrderForm(buyer=self.request.user, item=self.kwargs['item_id']))
        return context

    def post(self, request, *args, **kwargs):
        in_data = json.loads(request.body)
        if kwargs.get('order_id', "null") == "null":
            serializer = orderSerializer(data=in_data)
            if serializer.is_valid():
                serializer.save()
        else:
            old_order = Order.objects.filter(id=in_data['id'])[0]
            updated_order = orderSerializer(old_order, data=in_data)
            if updated_order.is_valid():
                print(type(in_data['status']))
                if in_data['status'] == "配送中".decode('utf-8'):
                    return HttpResponse("订单不能被修改 - 已经配送", status=404)
                    # return Response(status=500, data="订单不能被修改 - 已经配送")
                updated_order.save()

        # print (serializer.validated_data)
        # print (serializer.data)
        # print(serializer.errors)

        context = super(OrderFormView, self).get_context_data(**kwargs)

        return super(TemplateView, self).render_to_response(context)

    def delete(self, request, *args, **kwargs):
        Order.objects.filter(id=self.kwargs['order_id'])[0].delete()
        return HttpResponse('')

class FileUploadView(APIView):
    parser_classes = (FormParser, MultiPartParser,)

    def post(self, request, format=None):

        for filename, file in request.FILES.iteritems():

            with open('C:/Users/Allen/Desktop/tmp/'+str(file), 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

        # do some stuff with uploaded file
        return Response(status=204, data='C:/Users/Allen/Desktop/tmp/'+str(file))