import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { deriveKinds } from '@/models';
import { api } from '@/api/endpoints';
import { items as mockItems, locations as mockLocations, residence as mockResidence, storageTypes as mockTypes } from '@/api/mock';

/** VITE_DATA_SOURCE=api reads the DRF backend; anything else uses the sample data. */
const useApi = import.meta.env.VITE_DATA_SOURCE === 'api';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

/** Under par is Low; everything else is Stocked. Decided here rather than in components. */
export function status(item) {
  return item.par !== null && item.quantity < item.par ? 'low' : 'ok';
}

export const useHouseStore = defineStore('house', () => {
  const house = ref(null);
  const locations = ref([]);
  const items = ref([]);
  const types = ref([]);
  const loading = ref(false);
  const error = ref(null);
  /** Last failed save, kept apart from `error` so a failed PATCH doesn't blank the page. */
  const saveError = ref(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      if (useApi) {
        const [residence] = await api.residences();
        if (!residence) {
          throw new Error('No residence yet. Add one in the Django admin.');
        }
        const [apiLocations, apiItems, apiTypes] = await Promise.all([api.locations(residence.id), api.items(residence.id), api.types()]);
        house.value = residence;
        locations.value = deriveKinds(apiLocations);
        items.value = apiItems;
        types.value = apiTypes;
      } else {
        house.value = structuredClone(mockResidence);
        locations.value = deriveKinds(structuredClone(mockLocations));
        items.value = structuredClone(mockItems);
        types.value = structuredClone(mockTypes);
      }
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : String(exception);
    } finally {
      loading.value = false;
    }
  }

  // ---- tree lookups ----
  const byId = computed(() => new Map(locations.value.map((place) => [place.id, place])));
  const childMap = computed(() => {
    const byParent = new Map();
    for (const place of locations.value) {
      if (place.parent) {
        byParent.set(place.parent, [...(byParent.get(place.parent) ?? []), place]);
      }
    }
    return byParent;
  });
  const location = (id) => byId.value.get(id);
  const children = (id) => childMap.value.get(id) ?? [];
  const rooms = computed(() => locations.value.filter((place) => !place.parent));
  const item = (id) => items.value.find((candidate) => candidate.id === id);

  function subtree(id) {
    const out = new Set([id]);
    for (const child of children(id)) {
      for (const descendant of subtree(child.id)) {
        out.add(descendant);
      }
    }
    return out;
  }
  const itemsIn = (id, deep = true) => {
    const ids = deep ? subtree(id) : new Set([id]);
    return items.value.filter((record) => ids.has(record.location));
  };

  /** From the room down. */
  function ancestry(id) {
    const out = [];
    for (let place = location(id); place; place = place.parent ? location(place.parent) : undefined) {
      out.unshift(place);
    }
    return out;
  }
  const roomOf = (id) => ancestry(id)[0];

  /** Breadcrumbs that link each level into its room view. */
  function crumbs(id, withHouse = true) {
    const path = ancestry(id);
    const room = path[0];
    const list = path.map((place) => ({
      label: place.name,
      to: place.kind === 'room' ? `/rooms/${place.id}` : room ? { path: `/rooms/${room.id}`, query: place.kind === 'container' ? { in: place.id } : {} } : undefined,
    }));
    return withHouse ? [{ label: house.value?.name ?? 'House', to: '/' }, ...list] : list;
  }

  /** "Hall closet / Drawer B": skips furniture that only groups containers. */
  const pathText = (id) =>
    ancestry(id)
      .filter((place) => place.kind !== 'furniture' || children(place.id).length === 0)
      .map((place) => place.name)
      .join(' / ');

  // ---- status ----
  const lowItems = computed(() => items.value.filter((record) => status(record) === 'low'));

  function countsFor(id) {
    const list = itemsIn(id);
    return {
      total: list.length,
      low: list.filter((record) => status(record) === 'low').length,
    };
  }

  /** Every place an item can sit, grouped by room, labelled by its path inside the room. */
  const places = computed(() =>
    rooms.value.map((room) => ({
      room,
      options: [...subtree(room.id)]
        .filter((id) => id !== room.id)
        .map((id) => location(id))
        .map((place) => ({ id: place.id, label: ancestry(place.id).slice(1).map((ancestor) => ancestor.name).join(' / ') }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    })),
  );

  /** Everything with a printable code, or any container, for the Print labels page. */
  const labelled = computed(() => locations.value.filter((place) => place.code || place.kind === 'container' || place.kind === 'slot'));

  /** A location by its printed code (case-insensitive), falling back to an exact name. */
  function findByCode(query) {
    const term = query.trim().toLowerCase();
    if (!term) {
      return undefined;
    }
    return (
      locations.value.find((place) => place.code?.toLowerCase() === term)
      ?? locations.value.find((place) => place.name.toLowerCase() === term)
    );
  }

  // ---- actions ----
  const fail = (exception) => (saveError.value = exception instanceof Error ? exception.message : String(exception));
  const today = () => new Date().toISOString().slice(0, 10);

  /** `event` is the history line to save with the change, if any. */
  async function setQuantity(id, quantity, event) {
    const record = item(id);
    if (!record) {
      return;
    }
    const previous = record.quantity;
    record.quantity = quantity; // optimistic
    if (!useApi) {
      return;
    }
    try {
      await api.updateItem(id, { quantity, event });
      saveError.value = null;
    } catch (exception) {
      record.quantity = previous;
      fail(exception);
    }
  }

  async function addItem(draft) {
    const event = `Added ${draft.quantity}`;
    if (!useApi) {
      const local = {
        id: `${slug(draft.name)}-${Math.random().toString(36).slice(2, 7)}`,
        history: [{ date: today(), text: event }],
        ...draft,
      };
      items.value = [...items.value, local];
      return local;
    }
    try {
      const saved = await api.createItem({ ...draft, event });
      items.value = [...items.value, saved];
      saveError.value = null;
      return saved;
    } catch (exception) {
      fail(exception);
    }
  }

  async function updateItem(id, draft) {
    const record = item(id);
    if (!record) {
      return;
    }
    const before = { ...record };
    const moved = draft.location !== record.location;
    Object.assign(record, draft);
    if (moved) {
      recordMove(record, before.location);
    }
    if (!useApi) {
      return;
    }
    try {
      const moveFields = moved ? { moved_from: record.moved_from, event: record.history[0].text } : {};
      Object.assign(record, await api.updateItem(id, { ...draft, ...moveFields }));
      saveError.value = null;
    } catch (exception) {
      Object.assign(record, before);
      fail(exception);
    }
  }

  function recordMove(record, from) {
    record.moved_from = pathText(from);
    record.history = [{ date: today(), text: `Moved to ${pathText(record.location)}` }, ...record.history];
  }

  async function moveItem(id, to) {
    const record = item(id);
    if (!record || record.location === to) {
      return;
    }
    const before = { location: record.location, moved_from: record.moved_from, history: record.history };
    record.location = to;
    recordMove(record, before.location);
    if (!useApi) {
      return;
    }
    try {
      Object.assign(record, await api.updateItem(id, { location: to, moved_from: record.moved_from, event: record.history[0].text }));
      saveError.value = null;
    } catch (exception) {
      Object.assign(record, before);
      fail(exception);
    }
  }

  /** Fills a low item back up to par, saving the history line in the same request. */
  async function restock(id) {
    const record = item(id);
    if (!record || status(record) !== 'low') {
      return;
    }
    const before = { quantity: record.quantity, history: record.history };
    const event = `Restocked to ${record.par}`;
    record.quantity = record.par;
    record.history = [{ date: today(), text: event }, ...record.history];
    if (!useApi) {
      return;
    }
    try {
      Object.assign(record, await api.updateItem(id, { quantity: record.quantity, event }));
      saveError.value = null;
    } catch (exception) {
      Object.assign(record, before);
      fail(exception);
    }
  }

  /** Removes an item and returns a function that puts it back (for Undo). */
  async function removeItem(id) {
    const record = item(id);
    if (!record) {
      return;
    }
    const index = items.value.indexOf(record);
    items.value = items.value.filter((other) => other.id !== id);
    const restore = async () => {
      if (useApi) {
        // The API gives a re-created item a new id.
        const created = await api.createItem({ ...record, event: 'Restored' }).catch((exception) => (fail(exception), undefined));
        if (!created) {
          return;
        }
        Object.assign(record, created);
      }
      const next = [...items.value];
      next.splice(Math.min(index, next.length), 0, record);
      items.value = next;
    };
    if (!useApi) {
      return restore;
    }
    try {
      await api.deleteItem(id);
      saveError.value = null;
      return restore;
    } catch (exception) {
      items.value.splice(index, 0, record);
      fail(exception);
    }
  }

  // ---- rooms, storage spots and storage types ----
  const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  const typeName = (id) => types.value.find((storageType) => storageType.id === id)?.name;
  const typeUsage = (id) => locations.value.filter((place) => place.type === id).length;
  /** Ids at or below `id`, for keeping a spot from being moved inside itself. */
  const descendants = (id) => subtree(id);
  /** What removing a place would take with it. */
  const contentsOf = (id) => ({ items: itemsIn(id).length, places: subtree(id).size - 1 });

  async function addRoom(draft) {
    const home = house.value;
    if (!home) {
      return;
    }
    let room = { id: newId('room'), parent: null, ...draft };
    if (useApi) {
      try {
        room = await api.createLocation({ ...draft, residence: home.id });
        saveError.value = null;
      } catch (exception) {
        return void fail(exception);
      }
    }
    locations.value = deriveKinds([...locations.value, room]);
    return room;
  }

  async function updateRoom(id, draft) {
    const room = location(id);
    if (!room) {
      return;
    }
    const before = { name: room.name, note: room.note };
    Object.assign(room, draft);
    if (!useApi) {
      return;
    }
    try {
      await api.updateLocation(id, draft);
      saveError.value = null;
    } catch (exception) {
      Object.assign(room, before);
      fail(exception);
    }
  }

  async function addSpot(draft) {
    let spot = { id: newId('spot'), ...draft };
    if (useApi) {
      try {
        spot = await api.createLocation({ ...draft, residence: house.value.id });
        saveError.value = null;
      } catch (exception) {
        return void fail(exception);
      }
    }
    locations.value = deriveKinds([...locations.value, spot]);
    return spot;
  }

  async function updateSpot(id, draft) {
    const spot = location(id);
    if (!spot || descendants(id).has(draft.parent)) {
      return;
    }
    const before = { name: spot.name, parent: spot.parent, type: spot.type, code: spot.code, note: spot.note };
    Object.assign(spot, draft);
    deriveKinds(locations.value);
    if (!useApi) {
      return;
    }
    try {
      await api.updateLocation(id, draft);
      saveError.value = null;
    } catch (exception) {
      Object.assign(spot, before);
      deriveKinds(locations.value);
      fail(exception);
    }
  }

  /**
   * Removes a room or spot and everything inside it. Refused while items are inside:
   * the API would leave them with no spot, and they'd drop out of the app.
   */
  async function removePlace(id) {
    const place = location(id);
    if (!place) {
      return false;
    }
    const held = contentsOf(id).items;
    if (held) {
      saveError.value = `${place.name} still holds ${held} ${held === 1 ? 'item' : 'items'}. Move or remove them first.`;
      return false;
    }
    if (useApi) {
      try {
        await api.deleteLocation(id);
        saveError.value = null;
      } catch (exception) {
        fail(exception);
        return false;
      }
    }
    const gone = subtree(id);
    locations.value = deriveKinds(locations.value.filter((remaining) => !gone.has(remaining.id)));
    return true;
  }

  async function addType(name) {
    const clean = name.trim();
    if (!clean) {
      return;
    }
    const existing = types.value.find((storageType) => storageType.name.toLowerCase() === clean.toLowerCase());
    if (existing) {
      return existing;
    }
    const type = { id: newId('type'), name: clean };
    if (useApi) {
      try {
        type.id = (await api.createType(clean)).id;
        saveError.value = null;
      } catch (exception) {
        return void fail(exception);
      }
    }
    types.value = [...types.value, type].sort((left, right) => left.name.localeCompare(right.name));
    return type;
  }

  async function renameType(id, name) {
    const storageType = types.value.find((candidate) => candidate.id === id);
    const clean = name.trim();
    if (!storageType || !clean || clean === storageType.name) {
      return;
    }
    const before = storageType.name;
    storageType.name = clean;
    if (!useApi) {
      return;
    }
    try {
      await api.updateType(id, clean);
      saveError.value = null;
    } catch (exception) {
      storageType.name = before;
      fail(exception);
    }
  }

  async function removeType(id) {
    const used = typeUsage(id);
    if (used) {
      saveError.value = `${used} ${used === 1 ? 'place uses' : 'places use'} this type. Change them first.`;
      return false;
    }
    if (useApi) {
      try {
        await api.deleteType(id);
        saveError.value = null;
      } catch (exception) {
        fail(exception);
        return false;
      }
    }
    types.value = types.value.filter((storageType) => storageType.id !== id);
    return true;
  }

  function search(query) {
    const term = query.trim().toLowerCase();
    if (!term) {
      return [];
    }
    return items.value.filter((record) => `${record.name} ${pathText(record.location)} ${record.used_for ?? ''}`.toLowerCase().includes(term));
  }

  return {
    locations, items, types, loading, error, saveError, house, rooms, lowItems, places, labelled,
    typeName, typeUsage, descendants, contentsOf, addRoom, updateRoom, addSpot, updateSpot, removePlace, addType, renameType, removeType,
    load, location, children, item, itemsIn, ancestry, roomOf, crumbs, pathText, countsFor, findByCode, search,
    setQuantity, restock, addItem, updateItem, moveItem, removeItem,
  };
});
