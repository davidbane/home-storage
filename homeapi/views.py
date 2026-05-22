from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from .models import Owner, Residence, StorageArea, StorageItem, StorageSpot, StorageType
from .serializers import (
    OwnerSerializer,
    ResidenceSerializer,
    StorageAreaSerializer,
    StorageItemSerializer,
    StorageSpotSerializer,
    StorageTypeSerializer,
)


class HealthCheckViewSet(ViewSet):
    authentication_classes = []
    permission_classes = []

    def list(self, request):
        return Response({"status": "Healthy!"})


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
    queryset = StorageItem.objects.all()
    serializer_class = StorageItemSerializer
    authentication_classes = []
    permission_classes = []


class StorageAreaViewSet(ModelViewSet):
    queryset = StorageArea.objects.all()
    serializer_class = StorageAreaSerializer
    authentication_classes = []
    permission_classes = []


class StorageSpotViewSet(ModelViewSet):
    queryset = StorageSpot.objects.all()
    serializer_class = StorageSpotSerializer
    authentication_classes = []
    permission_classes = []


class StorageTypeViewSet(ModelViewSet):
    queryset = StorageType.objects.all()
    serializer_class = StorageTypeSerializer
    authentication_classes = []
    permission_classes = []
