from rest_framework import serializers

from homeapi.models import (
    Owner,
    Residence,
    StorageArea,
    StorageItem,
    StorageSpot,
    StorageType,
)


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        owner = Owner(**validated_data)
        if password:
            owner.set_password(password)
        owner.save()
        return owner

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class ResidenceSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer()

    class Meta:
        model = Residence
        fields = "__all__"


class StorageAreaSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False)

    class Meta:
        model = StorageArea
        fields = "__all__"


class StorageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageType
        fields = "__all__"


class StorageSpotSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    storage_area = StorageAreaSerializer()
    storage_type = StorageTypeSerializer()

    class Meta:
        model = StorageSpot
        fields = "__all__"

    def get_children(self, obj):
        serializer = StorageSpotSerializer(obj.children.all(), many=True)

        return serializer.data


class StorageItemSerializer(serializers.ModelSerializer):
    storage_spot = StorageSpotSerializer()

    class Meta:
        model = StorageItem
        fields = "__all__"
