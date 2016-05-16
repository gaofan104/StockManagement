# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stockManagement', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=120)),
                ('price', models.DecimalField(max_digits=20, decimal_places=2)),
                ('quantity', models.IntegerField()),
                ('image', models.ImageField(upload_to=b'img/%Y/%m/%d')),
                ('type', models.CharField(max_length=120)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('quantity', models.IntegerField()),
                ('phone', models.IntegerField()),
                ('address', models.CharField(max_length=512)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(max_length=30, null=True)),
                ('buyer', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(to='stockManagement.Item')),
            ],
        ),
    ]
