from django.db import transaction
from rest_framework import serializers

from homeapi.models import (
    ItemEvent,
    Location,
    Owner,
    Residence,
    StorageItem,
    StorageType,
)


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        owner = Owner(**validated_data)
        if password:
            owner.set_password(password)
        owner.save()
        return owner

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
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
        fields = '__all__'


class StorageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageType
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

    def validate(self, attrs):
        def value(field):
            return attrs.get(field, getattr(self.instance, field, None))

        parent = value('parent')
        residence = value('residence')
        if self.instance and residence != self.instance.residence:
            raise serializers.ValidationError(
                {'residence': "A location can't change residence."}
            )
        if parent and parent.residence != residence:
            raise serializers.ValidationError(
                {'parent': 'The parent is in a different residence.'}
            )
        if bool(parent) != bool(value('type')):
            raise serializers.ValidationError(
                {'type': "Storage spots need a type; rooms can't have one."}
            )
        ancestor = parent
        while self.instance and ancestor:
            if ancestor == self.instance:
                raise serializers.ValidationError(
                    {'parent': "A location can't move inside itself."}
                )
            ancestor = ancestor.parent
        return attrs


class ItemEventSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = ItemEvent
        fields = ['date', 'text']


class StorageItemSerializer(serializers.ModelSerializer):
    history = ItemEventSerializer(many=True, read_only=True)
    event = serializers.CharField(write_only=True, required=False, max_length=255)

    class Meta:
        model = StorageItem
        fields = '__all__'

    def create(self, validated_data):
        event = validated_data.pop('event', None)
        with transaction.atomic():
            item = super().create(validated_data)
            self._log(item, event)
        return item

    def update(self, instance, validated_data):
        event = validated_data.pop('event', None)
        with transaction.atomic():
            item = super().update(instance, validated_data)
            self._log(item, event)
        return item

    @staticmethod
    def _log(item, event):
        if event:
            item.history.create(text=event)
