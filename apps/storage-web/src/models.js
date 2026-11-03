// The app's view of the catalog. API responses are adapted into these shapes (see api/adapt.js).

/**
 * Locations form one tree: house → room → furniture → container → slot.
 *
 * @typedef {object} Location
 * @property {string} id
 * @property {string} name
 * @property {'house' | 'room' | 'furniture' | 'container' | 'slot'} kind
 * @property {string | null} parent
 * @property {string} [code] Printed label code, e.g. "C-07-B".
 * @property {string} [note] Short note shown under a tile, e.g. "chargers".
 * @property {string} [type] Storage type id (spots only), e.g. the "Drawer" type.
 */

/**
 * A kind of storage spot: "Drawer chest", "Bin", "Shelf". Backed by the API's StorageType.
 *
 * @typedef {object} StorageType
 * @property {string} id
 * @property {string} name
 */

/**
 * What the room form produces.
 *
 * @typedef {object} RoomDraft
 * @property {string} name
 * @property {string} [note]
 */

/**
 * What the storage spot form produces. `parent` is a room or another spot.
 *
 * @typedef {object} SpotDraft
 * @property {string} name
 * @property {string} parent
 * @property {string} type
 * @property {string} [code]
 * @property {string} [note]
 */

/**
 * Sets each spot's kind from its depth below its room, the one rule for the whole app:
 * a top-level spot with children is furniture, a top-level spot without children is a
 * container, its children are containers, and anything deeper is a slot.
 */
export function deriveKinds(locations) {
  const byId = new Map(locations.map((location) => [location.id, location]))
  const parents = new Set(locations.flatMap((location) => (location.parent ? [location.parent] : [])))
  const depth = (location) => {
    const parent = location.parent ? byId.get(location.parent) : undefined
    return !parent || parent.kind === 'house' || parent.kind === 'room' ? 0 : 1 + depth(parent)
  }
  for (const location of locations) {
    if (location.kind === 'house' || location.kind === 'room') continue
    const level = depth(location)
    location.kind = level === 0 ? (parents.has(location.id) ? 'furniture' : 'container') : level === 1 ? 'container' : 'slot'
  }
  return locations
}

/**
 * @typedef {object} ItemEvent
 * @property {string} date ISO date
 * @property {string} text
 */

/**
 * @typedef {object} Item
 * @property {string} id
 * @property {string} name
 * @property {number} quantity
 * @property {number | null} par Target count; under it is Low. Null when the item isn't tracked against a par.
 * @property {'daily' | 'surplus' | 'long_term'} storage_class How an item is kept, independent of how many there are.
 * @property {string} location
 * @property {string} [brand]
 * @property {string} [used_for]
 * @property {string} [moved_from]
 * @property {ItemEvent[]} history
 */

/**
 * What the add and edit forms produce: an Item's name, quantity, par, storage_class,
 * location, brand and used_for.
 *
 * @typedef {Pick<Item, 'name' | 'quantity' | 'par' | 'storage_class' | 'location' | 'brand' | 'used_for'>} ItemDraft
 */
