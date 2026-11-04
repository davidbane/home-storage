import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    """
    Replaces StorageArea and StorageSpot with one Location tree. Schema only: this
    drops every area, spot and item. Residences, owners and storage types are kept.
    """

    dependencies = [
        ("materia", "0001_initial"),
    ]

    operations = [
        migrations.DeleteModel(name="StorageItem"),
        migrations.DeleteModel(name="StorageSpot"),
        migrations.DeleteModel(name="StorageArea"),
        migrations.CreateModel(
            name="Location",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=75)),
                ("code", models.CharField(blank=True, max_length=30)),
                ("note", models.TextField(blank=True)),
                ("primary_color", models.CharField(blank=True, max_length=30)),
                ("secondary_color", models.CharField(blank=True, max_length=30)),
                ("qr_code_image_url", models.URLField(blank=True)),
                ("parent", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="children", to="materia.location")),
                ("residence", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="locations", to="materia.residence")),
                ("type", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to="materia.storagetype")),
            ],
        ),
        migrations.AddConstraint(
            model_name="location",
            constraint=models.CheckConstraint(
                check=models.Q(models.Q(("parent__isnull", True), ("type__isnull", True)), models.Q(("parent__isnull", False), ("type__isnull", False)), _connector="OR"),
                name="only_storage_spots_have_a_type",
            ),
        ),
        migrations.CreateModel(
            name="StorageItem",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=30)),
                ("brand", models.CharField(blank=True, max_length=20)),
                ("quantity", models.IntegerField()),
                ("par", models.PositiveIntegerField(blank=True, null=True)),
                ("storage_class", models.CharField(choices=[("daily", "Daily"), ("surplus", "Surplus"), ("long_term", "Long Term")], default="daily", max_length=10)),
                ("used_for", models.TextField(blank=True)),
                ("moved_from", models.TextField(blank=True)),
                ("location", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="items", to="materia.location")),
            ],
        ),
        migrations.CreateModel(
            name="ItemEvent",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("text", models.CharField(max_length=255)),
                ("item", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="history", to="materia.storageitem")),
            ],
            options={"ordering": ["-date"]},
        ),
    ]
