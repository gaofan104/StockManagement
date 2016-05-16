from djng.forms import NgModelFormMixin, NgModelForm, NgFormValidationMixin
from djng.styling.bootstrap3.forms import Bootstrap3FormMixin
from djng.forms import NgDeclarativeFieldsMetaclass, field_mixins

from .models import Order
from django.utils import six
from django import forms
from django.contrib.auth.models import User
from .models import Item


class AddressFieldWidget(forms.MultiWidget):
    def decompress(self, value):
        if value:
            return [value[0], value[1], value[2]]
        return ''

    def format_output(self, rendered_widgets):
        str = ''
        line = []
        line.append('<p></p><td class="align_left"><label for="contact_phone">Address 1</label></td>')
        line.append('<p></p><td class="align_left"><label for="contact_phone">Address 2</label></td>')
        line.append('<p></p><td class="align_left"><label for="contact_phone">Address 3</label></td>')

        for i, field in enumerate(rendered_widgets):
            str += '<tr>' + line[i]
            field = field.replace('ng-model="address"', 'ng-model="address._%s"' % i, 1)
            str += '<td class="align_right">%s</td></tr>' % field
        return '<tr>' + str + '</tr>'

    def value_from_datadict(self,data,files,name):
        res = []
        for i, widget in enumerate(self.widgets):
            res.append(widget.value_from_datadict(data, files, name + '_%s' % i))
        return res


class AddressField(forms. MultiValueField):
    def __init__(self, *args, **kwargs):
        fields = (
            forms.CharField(widget=forms.TextInput(), min_length=3, max_length=20),
            forms.CharField(widget=forms.TextInput(), min_length=3, max_length=20, required=False),
            forms.CharField(widget=forms.TextInput(), min_length=3, max_length=20, required=False),
        )
        self.widget = AddressFieldWidget(widgets=[fields[0].widget, fields[1].widget, fields[2].widget])
        super(AddressField, self).__init__(fields=fields, *args, **kwargs)

    def compress(self, data_list):
        return data_list[0] + ' ' + data_list[1] + ' ' + data_list[2]


class OrderForm(NgModelFormMixin, NgModelForm, NgFormValidationMixin, Bootstrap3FormMixin):
    form_name = 'order_form'
    # address = forms.CharField(label='address', required=True, min_length=3, max_length=20)
    address = AddressField()

    class Meta:
        model = Order
        fields = ['item', 'buyer', 'quantity', 'phone', 'address']

        # readonly_fields = ['id', 'updated']
    # def clean_address(self):
    #     address = self.cleaned_data.get('email')
    #     if address.length < 3:
    #         raise forms.ValidationError("address has to be at least 3 chars")
    #     return address

    def __init__(self, *args, **kwargs):
        self.buyer = kwargs.pop('buyer', None)
        self.item = kwargs.pop('item', None)
        super(OrderForm, self).__init__(*args, **kwargs)
        if User.objects.filter(username=self.buyer).exists():
            self.fields['buyer'].initial = User.objects.filter(username=self.buyer)[0]
        self.fields['buyer'].queryset = User.objects.filter(username=self.buyer)
        if Item.objects.filter(id=self.item).exists():
            self.fields['item'].initial = Item.objects.filter(id=self.item)[0]
        self.fields['item'].queryset = Item.objects.filter(id=self.item)