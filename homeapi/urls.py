from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    HealthCheckViewSet,
    OwnerViewSet,
    ResidenceViewSet,
    StorageAreaViewSet,
    StorageItemViewSet,
    StorageSpotViewSet,
    StorageTypeViewSet,
)

router = DefaultRouter()
router.register(r"residences", ResidenceViewSet, basename="residences")
router.register(r"owners", OwnerViewSet, basename="owners")
router.register(r"storage-items", StorageItemViewSet, basename="storage-items")
router.register(r"storage-areas", StorageAreaViewSet, basename="storage-areas")
router.register(r"storage-types", StorageTypeViewSet, basename="storage-types")
router.register(r"storage-spots", StorageSpotViewSet, basename="storage-spots")

urlpatterns = [
    path("health/", HealthCheckViewSet.as_view({"get": "list"}), name="health-check"),
]

urlpatterns += router.urls
