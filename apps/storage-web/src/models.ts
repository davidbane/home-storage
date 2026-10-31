// The app's view of the catalog. API responses are adapted into these shapes (see api/adapt.ts).

/** Locations form one tree: house → room → furniture → container → slot. */
export type LocationKind = 'house' | 'room' | 'furniture' | 'container' | 'slot'

export interface Location {
  id: string
  name: string
  kind: LocationKind
  parent: string | null
  /** Printed label code, e.g. "C-07-B". */
  code?: string
  /** Short note shown under a tile, e.g. "chargers". */
  note?: string
  /** Storage type id (spots only), e.g. the "Drawer" type. */
  type?: string
}

/** A kind of storage spot: "Drawer chest", "Bin", "Shelf". Backed by the API's StorageType. */
export interface StorageType {
  id: string
  name: string
}

/** What the room form produces. */
export interface RoomDraft {
  name: string
  note?: string
}

/** What the storage spot form produces. `parent` is a room or another spot. */
export interface SpotDraft {
  name: string
  parent: string
  type: string
  code?: string
  note?: string
}

/**
 * Sets each spot's kind from its depth below its room, the one rule for the whole app:
 * a top-level spot with children is furniture, a top-level spot without children is a
 * container, its children are containers, and anything deeper is a slot.
 */
export function deriveKinds(locations: Location[]): Location[] {
  const byId = new Map(locations.map((l) => [l.id, l]))
  const parents = new Set(locations.flatMap((l) => (l.parent ? [l.parent] : [])))
  const depth = (l: Location): number => {
    const p = l.parent ? byId.get(l.parent) : undefined
    return !p || p.kind === 'house' || p.kind === 'room' ? 0 : 1 + depth(p)
  }
  for (const l of locations) {
    if (l.kind === 'house' || l.kind === 'room') continue
    const d = depth(l)
    l.kind = d === 0 ? (parents.has(l.id) ? 'furniture' : 'container') : d === 1 ? 'container' : 'slot'
  }
  return locations
}

/** How an item is kept, independent of how many there are. */
export type StorageClass = 'daily' | 'surplus' | 'long_term'

export interface ItemEvent {
  date: string // ISO date
  text: string
}

export interface Item {
  id: string
  name: string
  quantity: number
  /** Target count; under it is Low. Null when the item isn't tracked against a par. */
  par: number | null
  storage_class: StorageClass
  location: string
  brand?: string
  used_for?: string
  moved_from?: string
  history: ItemEvent[]
}

/** What the add and edit forms produce. */
export type ItemDraft = Pick<Item, 'name' | 'quantity' | 'par' | 'storage_class' | 'location' | 'brand' | 'used_for'>
