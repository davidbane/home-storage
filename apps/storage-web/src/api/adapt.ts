import type { Item, Location } from '@/models'
import type { ApiResidence, ApiStorageArea, ApiStorageItem, ApiStorageSpot } from './endpoints'

/**
 * Turns the API's residence / area / spot / item records into the app's single
 * location tree: house → room → furniture → container → slot.
 *
 * Spot kind comes from depth: a top-level spot with children is furniture,
 * a top-level spot without children is a container, and deeper spots are
 * containers then slots.
 */
export function adapt(
  residence: ApiResidence,
  areas: ApiStorageArea[],
  spots: ApiStorageSpot[],
  items: ApiStorageItem[],
): { locations: Location[]; items: Item[] } {
  const roomIds = new Set(areas.filter((a) => a.residence === residence.id).map((a) => a.id))
  const ourSpots = spots.filter((s) => roomIds.has(s.storage_area.id))
  const byId = new Map(ourSpots.map((s) => [s.id, s]))
  const hasChildren = new Set(ourSpots.flatMap((s) => (s.parent ? [s.parent] : [])))
  const depth = (s: ApiStorageSpot): number => (s.parent && byId.has(s.parent) ? 1 + depth(byId.get(s.parent)!) : 0)

  const locations: Location[] = [
    { id: residence.id, name: residence.name, kind: 'house', parent: null },
    ...areas
      .filter((a) => roomIds.has(a.id))
      .map((a): Location => ({ id: a.id, name: a.name, kind: 'room', parent: residence.id, note: a.description ?? undefined })),
    ...ourSpots.map((s): Location => {
      const d = depth(s)
      const kind = d === 0 ? (hasChildren.has(s.id) ? 'furniture' : 'container') : d === 1 ? 'container' : 'slot'
      return {
        id: s.id,
        name: s.name,
        kind,
        parent: s.parent && byId.has(s.parent) ? s.parent : s.storage_area.id,
        note: s.description || undefined,
      }
    }),
  ]

  const spotIds = new Set(ourSpots.map((s) => s.id))
  return {
    locations,
    items: items
      .filter((i) => i.storage_spot && spotIds.has(i.storage_spot.id))
      .map(
        (i): Item => ({
          id: i.id,
          name: i.name,
          quantity: i.count,
          // Not in the API yet: par, storage class, history.
          par: null,
          storage_class: 'daily',
          location: i.storage_spot!.id,
          brand: i.brand || undefined,
          used_for: i.description || undefined,
          history: [],
        }),
      ),
  }
}
