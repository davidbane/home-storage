from django.db.models import ProtectedError
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from .models import Location, Owner, Residence, StorageItem, StorageType
from .serializers import (
    LocationSerializer,
    OwnerSerializer,
    ResidenceSerializer,
    StorageItemSerializer,
    StorageTypeSerializer,
)


def residence_param(request):
    """The ?residence= filter as a UUID, or None. A malformed id is a 400."""
    value = request.query_params.get('residence')
    return serializers.UUIDField().to_internal_value(value) if value else None


class ProtectedDestroyMixin:
    """Answers 409 rather than 500 when something still depends on the record."""

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'detail': 'This is still in use.'}, status=status.HTTP_409_CONFLICT
            )


class HealthCheckViewSet(ViewSet):
    authentication_classes = []
    permission_classes = []

    def list(self, request):
        return Response({'status': 'Healthy!'})


class ResidenceViewSet(ModelViewSet):
    queryset = Residence.objects.all()
    serializer_class = ResidenceSerializer
    authentication_classes = []
    permission_classes = []


class OwnerViewSet(ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    authentication_classes = []
    permission_classes = []


class StorageItemViewSet(ModelViewSet):
    serializer_class = StorageItemSerializer
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        items = StorageItem.objects.prefetch_related('history')
        residence = residence_param(self.request)
        return items.filter(location__residence=residence) if residence else items


class LocationViewSet(ProtectedDestroyMixin, ModelViewSet):
    serializer_class = LocationSerializer
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        residence = residence_param(self.request)
        locations = Location.objects.all()
        return locations.filter(residence=residence) if residence else locations


class StorageTypeViewSet(ProtectedDestroyMixin, ModelViewSet):
    queryset = StorageType.objects.all()
    serializer_class = StorageTypeSerializer
    authentication_classes = []
    permission_classes = []
