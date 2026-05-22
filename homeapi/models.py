import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class Owner(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


class Residence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        Owner, on_delete=models.CASCADE, related_name="residences"
    )
    name = models.CharField(max_length=50)
    residence_type = models.CharField(max_length=30)


class StorageType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, unique=True)


class StorageArea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    residence = models.ForeignKey(
        Residence, on_delete=models.CASCADE, related_name="areas"
    )
    description = models.TextField(null=True)
    name = models.CharField(max_length=50)


# TODO: probably time to create a git project for this
# TODO: looking at creating a frontend next
class StorageSpot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    name = models.CharField(max_length=75)
    storage_type = models.ForeignKey(StorageType, on_delete=models.PROTECT)
    storage_area = models.ForeignKey(
        StorageArea, on_delete=models.CASCADE, related_name="spots"
    )
    primary_color = models.CharField(max_length=30, blank=True)
    secondary_color = models.CharField(max_length=30, blank=True)
    description = models.TextField(blank=True)


class StorageItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    storage_spot = models.ForeignKey(
        StorageSpot, on_delete=models.SET_NULL, null=True, related_name="items"
    )
    name = models.CharField(max_length=30)
    brand = models.CharField(max_length=20)
    count = models.IntegerField()
    description = models.TextField(blank=True)
