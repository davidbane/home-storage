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


class Location(models.Model):
    """A node in a residence's tree: a room when it has no parent, otherwise a storage spot."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    residence = models.ForeignKey(
        Residence, on_delete=models.CASCADE, related_name="locations"
    )
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    name = models.CharField(max_length=75)
    type = models.ForeignKey(
        StorageType, on_delete=models.PROTECT, null=True, blank=True
    )
    code = models.CharField(max_length=30, blank=True)
    note = models.TextField(blank=True)
    primary_color = models.CharField(max_length=30, blank=True)
    secondary_color = models.CharField(max_length=30, blank=True)
    qr_code_image_url = models.URLField(blank=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(parent__isnull=True, type__isnull=True)
                | models.Q(parent__isnull=False, type__isnull=False),
                name="only_storage_spots_have_a_type",
            ),
        ]


class StorageItem(models.Model):
    class StorageClass(models.TextChoices):
        DAILY = "daily"
        SURPLUS = "surplus"
        LONG_TERM = "long_term"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    location = models.ForeignKey(
        Location, on_delete=models.PROTECT, related_name="items"
    )
    name = models.CharField(max_length=30)
    brand = models.CharField(max_length=20, blank=True)
    quantity = models.IntegerField()
    par = models.PositiveIntegerField(null=True, blank=True)
    storage_class = models.CharField(
        max_length=10, choices=StorageClass.choices, default=StorageClass.DAILY
    )
    used_for = models.TextField(blank=True)
    moved_from = models.TextField(blank=True)


class ItemEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(
        StorageItem, on_delete=models.CASCADE, related_name="history"
    )
    date = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=255)

    class Meta:
        ordering = ["-date"]
