from django.db import models
from django.contrib.auth.models import User

# items Model
class Item(models.Model):
	name = models.CharField(max_length=120)
	price = models.FloatField()
	quantity = models.IntegerField(blank=False, null=False)
	image = models.ImageField(upload_to='img/%Y/%m/%d')
	type = models.CharField(max_length=120, blank=False, null=False)
	updated = models.DateTimeField(auto_now_add=False, auto_now=True)

	def admin_image(self):
		return '<img src="%s" height="40"/>' % self.image.url
	admin_image.short_description = 'Image'
	admin_image.allow_tags = True


	def __unicode__(self): #python 3.3 is __str__
		return self.name


# order Model
class Order(models.Model):
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer')
	quantity = models.IntegerField(blank=False, null=False)
	phone = models.IntegerField(blank=False, null=False)
	address = models.CharField(max_length=512, null=False, blank=False)
	deliveryman = models.ForeignKey(User, on_delete=models.CASCADE, related_name='deliveryman', null=True)
	updated = models.DateTimeField(auto_now_add=False, auto_now=True)
	status = models.CharField(max_length=30, null=True)

	def __unicode__(self): #python 3.3 is __str__
		return self.item.name