from rest_framework.test import APITestCase

from .models import Location, Owner, Residence, StorageItem, StorageType


class ApiTestCase(APITestCase):
    def setUp(self):
        owner = Owner.objects.create(username='owner')
        self.residence = Residence.objects.create(
            owner=owner, name='Home', residence_type='house'
        )
        self.elsewhere = Residence.objects.create(
            owner=owner, name='Cabin', residence_type='cabin'
        )
        self.drawer_type = StorageType.objects.create(name='Drawer')
        self.room = Location.objects.create(residence=self.residence, name='Kitchen')
        self.other_room = Location.objects.create(
            residence=self.residence, name='Garage'
        )
        self.spot = self.add_spot('Chest', self.room)
        self.child = self.add_spot('Drawer A', self.spot)

    def add_spot(self, name, parent):
        return Location.objects.create(
            residence=parent.residence, parent=parent, name=name, type=self.drawer_type
        )

    def add_item(self, location=None):
        return StorageItem.objects.create(
            location=location or self.child, name='Tape', quantity=1
        )


class LocationTests(ApiTestCase):
    def test_room_can_be_created_without_a_note(self):
        response = self.client.post(
            '/api/locations/',
            {'name': 'Attic', 'note': '', 'residence': self.residence.id},
            format='json',
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertIsNone(response.data['parent'])

    def test_spot_can_be_created_directly_in_a_room_with_a_code(self):
        response = self.client.post(
            '/api/locations/',
            {
                'name': 'Bin',
                'code': 'C-07',
                'parent': self.room.id,
                'type': self.drawer_type.id,
                'residence': self.residence.id,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['code'], 'C-07')

    def test_moving_a_spot_to_another_room_brings_its_children(self):
        response = self.client.patch(
            f'/api/locations/{self.spot.id}/',
            {'parent': self.other_room.id},
            format='json',
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.child.refresh_from_db()
        self.assertEqual(self.child.parent.parent, self.other_room)

    def test_spot_needs_a_type(self):
        response = self.client.post(
            '/api/locations/',
            {'name': 'Bin', 'parent': self.room.id, 'residence': self.residence.id},
            format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_room_cannot_have_a_type(self):
        response = self.client.post(
            '/api/locations/',
            {
                'name': 'Attic',
                'type': self.drawer_type.id,
                'residence': self.residence.id,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_parent_must_be_in_the_same_residence(self):
        response = self.client.post(
            '/api/locations/',
            {
                'name': 'Bin',
                'parent': self.room.id,
                'type': self.drawer_type.id,
                'residence': self.elsewhere.id,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_residence_cannot_change(self):
        response = self.client.patch(
            f'/api/locations/{self.room.id}/',
            {'residence': self.elsewhere.id},
            format='json',
        )
        self.assertEqual(response.status_code, 400)

    def test_spot_cannot_move_inside_itself(self):
        response = self.client.patch(
            f'/api/locations/{self.spot.id}/', {'parent': self.child.id}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_location_holding_items_cannot_be_deleted_even_deep_down(self):
        self.add_item()
        response = self.client.delete(f'/api/locations/{self.room.id}/')
        self.assertEqual(response.status_code, 409)
        self.assertTrue(Location.objects.filter(id=self.child.id).exists())

    def test_empty_location_is_deleted_with_its_children(self):
        response = self.client.delete(f'/api/locations/{self.room.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Location.objects.filter(id=self.child.id).exists())

    def test_list_filters_by_residence(self):
        other = Location.objects.create(residence=self.elsewhere, name='Loft')
        response = self.client.get('/api/locations/', {'residence': self.residence.id})
        self.assertNotIn(
            str(other.id), [str(location['id']) for location in response.data]
        )
        self.assertEqual(len(response.data), 4)

    def test_malformed_residence_filter_is_a_400(self):
        self.assertEqual(
            self.client.get('/api/locations/', {'residence': 'nope'}).status_code, 400
        )


class StorageItemTests(ApiTestCase):
    def test_create_keeps_every_field_and_logs_the_event(self):
        response = self.client.post(
            '/api/storage-items/',
            {
                'name': 'Batteries',
                'brand': '',
                'quantity': 2,
                'par': 4,
                'used_for': '',
                'location': self.child.id,
                'event': 'Added 2',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['par'], 4)
        self.assertEqual(
            [entry['text'] for entry in response.data['history']], ['Added 2']
        )
        self.assertRegex(response.data['history'][0]['date'], r'^\d{4}-\d{2}-\d{2}$')
        self.assertNotIn('event', response.data)

    def test_move_saves_the_location_and_its_history_together(self):
        item = self.add_item()
        response = self.client.patch(
            f'/api/storage-items/{item.id}/',
            {
                'location': self.spot.id,
                'moved_from': 'Kitchen / Drawer A',
                'event': 'Moved to Chest',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data['location'], self.spot.id)
        self.assertEqual(response.data['moved_from'], 'Kitchen / Drawer A')
        self.assertEqual(
            [entry['text'] for entry in response.data['history']], ['Moved to Chest']
        )

    def test_history_is_newest_first(self):
        item = self.add_item()
        for text in ['First', 'Second']:
            self.client.patch(
                f'/api/storage-items/{item.id}/', {'event': text}, format='json'
            )
        response = self.client.get(f'/api/storage-items/{item.id}/')
        self.assertEqual(
            [entry['text'] for entry in response.data['history']], ['Second', 'First']
        )

    def test_update_without_an_event_logs_nothing(self):
        item = self.add_item()
        response = self.client.patch(
            f'/api/storage-items/{item.id}/', {'quantity': 5}, format='json'
        )
        self.assertEqual(response.data['quantity'], 5)
        self.assertEqual(response.data['history'], [])

    def test_list_filters_by_residence(self):
        item = self.add_item()
        self.add_item(Location.objects.create(residence=self.elsewhere, name='Loft'))
        response = self.client.get(
            '/api/storage-items/', {'residence': self.residence.id}
        )
        self.assertEqual([entry['id'] for entry in response.data], [str(item.id)])


class StorageTypeTests(ApiTestCase):
    def test_type_in_use_cannot_be_deleted(self):
        self.assertEqual(
            self.client.delete(
                f'/api/storage-types/{self.drawer_type.id}/'
            ).status_code,
            409,
        )
