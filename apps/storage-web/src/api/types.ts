// Shapes the DRF API is expected to return. Keep these in step with the serializers.

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
