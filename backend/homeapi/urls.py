from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    HealthCheckViewSet,
    LocationViewSet,
    OwnerViewSet,
    ResidenceViewSet,
    StorageItemViewSet,
    StorageTypeViewSet,
)

router = DefaultRouter()
router.register(r"residences", ResidenceViewSet, basename="residences")
router.register(r"owners", OwnerViewSet, basename="owners")
router.register(r"storage-items", StorageItemViewSet, basename="storage-items")
router.register(r"locations", LocationViewSet, basename="locations")
router.register(r"storage-types", StorageTypeViewSet, basename="storage-types")

urlpatterns = [
    path("health/", HealthCheckViewSet.as_view({"get": "list"}), name="health-check"),
]

urlpatterns += router.urls
