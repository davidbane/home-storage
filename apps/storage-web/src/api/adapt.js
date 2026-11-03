import { deriveKinds } from '@/models'

/**
 * Turns the API's residence / area / spot / item records into the app's single
 * location tree: house → room → furniture → container → slot.
 *
 * Spot kinds come from depth (deriveKinds in models.ts).
 */
export function adapt(residence, areas, spots, items) {
  const roomIds = new Set(areas.filter((a) => a.residence === residence.id).map((a) => a.id))
  const ourSpots = spots.filter((s) => roomIds.has(s.storage_area.id))
  const byId = new Map(ourSpots.map((s) => [s.id, s]))

  const locations = deriveKinds([
    { id: residence.id, name: residence.name, kind: 'house', parent: null },
    ...areas
      .filter((a) => roomIds.has(a.id))
      .map((a) => ({ id: a.id, name: a.name, kind: 'room', parent: residence.id, note: a.description ?? undefined })),
    ...ourSpots.map(
      (s) => ({
        id: s.id,
        name: s.name,
        kind: 'container',
        parent: s.parent && byId.has(s.parent) ? s.parent : s.storage_area.id,
        note: s.description || undefined,
        type: s.storage_type.id,
      }),
    ),
  ])

  const spotIds = new Set(ourSpots.map((s) => s.id))
  return {
    locations,
    items: items
      .filter((i) => i.storage_spot && spotIds.has(i.storage_spot.id))
      .map(
        (i) => ({
          id: i.id,
          name: i.name,
          quantity: i.count,
          // Not in the API yet: par, storage class, history.
          par: null,
          storage_class: 'daily',
          location: i.storage_spot.id,
          brand: i.brand || undefined,
          used_for: i.description || undefined,
          history: [],
        }),
      ),
  }
}
