# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stockManagement', '0002_item_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='deliveryman',
            field=models.ForeignKey(related_name='deliveryman', to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='price',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='order',
            name='buyer',
            field=models.ForeignKey(related_name='buyer', to=settings.AUTH_USER_MODEL),
        ),
    ]
