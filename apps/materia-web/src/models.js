// The catalog as backend/materia/serializers.py returns it, plus `kind` (see deriveKinds).

/**
 * @typedef {object} Residence
 * @property {string} id
 * @property {string} name
 */

/**
 * Locations form one tree per residence: room → furniture → container → slot.
 *
 * @typedef {object} Location
 * @property {string} id
 * @property {string} name
 * @property {string} residence
 * @property {'room' | 'furniture' | 'container' | 'slot'} kind Set by deriveKinds, not stored.
 * @property {string | null} parent Null for a room.
 * @property {string} [code] Printed label code, e.g. "C-07-B".
 * @property {string} [note] Short note shown under a tile, e.g. "chargers".
 * @property {string | null} [type] Storage type id (spots only), e.g. the "Drawer" type.
 */

/**
 * A kind of storage spot: "Drawer chest", "Bin", "Shelf".
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
 * @property {string} note
 */

/**
 * What the storage spot form produces. `parent` is a room or another spot.
 *
 * @typedef {object} SpotDraft
 * @property {string} name
 * @property {string} parent
 * @property {string} type
 * @property {string} code
 * @property {string} note
 */

/**
 * Sets each spot's kind from its depth below its room, the one rule for the whole app:
 * a top-level spot with children is furniture, a top-level spot without children is a
 * container, its children are containers, and anything deeper is a slot.
 */
export function deriveKinds(locations) {
  const byId = new Map(locations.map((location) => [location.id, location]));
  const parents = new Set(locations.flatMap((location) => (location.parent ? [location.parent] : [])));
  const depth = (location) => {
    const parent = byId.get(location.parent);
    return !parent?.parent ? 0 : 1 + depth(parent);
  };
  for (const location of locations) {
    if (!location.parent) {
      location.kind = 'room';
      continue;
    }
    const level = depth(location);
    location.kind = level === 0 ? (parents.has(location.id) ? 'furniture' : 'container') : level === 1 ? 'container' : 'slot';
  }
  return locations;
}

/**
 * @typedef {object} ItemEvent
 * @property {string} date ISO timestamp
 * @property {string} text
 */

/**
 * @typedef {object} Item
 * @property {string} id
 * @property {string} name
 * @property {number} quantity
 * @property {number | null} par Target count; under it is Low. Null when the item isn't tracked against a par.
 * @property {string} location
 * @property {string} [brand]
 * @property {string} [used_for]
 * @property {string} [moved_from]
 * @property {ItemEvent[]} history
 */

/**
 * What the add and edit forms produce: an Item's name, quantity, par,
 * location, brand and used_for.
 *
 * @typedef {Pick<Item, 'name' | 'quantity' | 'par' | 'location' | 'brand' | 'used_for'>} ItemDraft
 */
