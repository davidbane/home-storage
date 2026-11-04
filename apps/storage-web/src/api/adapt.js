import { deriveKinds } from '@/models';

/**
 * Turns the API's residence / area / spot / item records into the app's single
 * location tree: house → room → furniture → container → slot.
 *
 * Spot kinds come from depth (deriveKinds in models.js).
 *
 */
export function adapt(residence, areas, spots, items) {
  const roomIds = new Set(areas.filter((area) => area.residence === residence.id).map((area) => area.id));
  const ourSpots = spots.filter((spot) => roomIds.has(spot.storage_area.id));
  const byId = new Map(ourSpots.map((spot) => [spot.id, spot]));

  const locations = deriveKinds([
    { id: residence.id, name: residence.name, kind: 'house', parent: null },
    ...areas
      .filter((area) => roomIds.has(area.id))
      .map((area) => ({ id: area.id, name: area.name, kind: 'room', parent: residence.id, note: area.description ?? undefined })),
    ...ourSpots.map(
      (spot) => ({
        id: spot.id,
        name: spot.name,
        kind: 'container',
        parent: spot.parent && byId.has(spot.parent) ? spot.parent : spot.storage_area.id,
        note: spot.description || undefined,
        type: spot.storage_type.id,
      }),
    ),
  ]);

  const spotIds = new Set(ourSpots.map((spot) => spot.id));
  return {
    locations,
    items: items
      .filter((item) => item.storage_spot && spotIds.has(item.storage_spot.id))
      .map(
        (item) => ({
          id: item.id,
          name: item.name,
          quantity: item.count,
          // Not in the API yet: par, storage class, history.
          par: null,
          storage_class: 'daily',
          location: item.storage_spot.id,
          brand: item.brand || undefined,
          used_for: item.description || undefined,
          history: [],
        }),
      ),
  };
}
