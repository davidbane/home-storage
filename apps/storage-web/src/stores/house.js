import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { deriveKinds } from '@/models'
import { api } from '@/api/endpoints'
import { adapt } from '@/api/adapt'
import { items as mockItems, locations as mockLocations, storageTypes as mockTypes } from '@/api/mock'

/** VITE_DATA_SOURCE=api reads the DRF backend; anything else uses the sample data. */
const useApi = import.meta.env.VITE_DATA_SOURCE === 'api'

const LIST_KEY = 'home-storage:shopping'
function readList() {
  try {
    const stored = JSON.parse(localStorage.getItem(LIST_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'

/** The fields the API knows today. Par, storage class and history stay client-side until it has them. */
const toApi = (draft) => ({
  name: draft.name,
  brand: draft.brand ?? '',
  count: draft.quantity,
  description: draft.used_for ?? '',
  storage_spot: draft.location,
})

/**
 * The four statuses, decided here rather than in components:
 * long-term storage class → Long-term; under par → Low;
 * surplus storage class or at least double par → Surplus; else Stocked.
 */
export function status(item) {
  if (item.storage_class === 'long_term') return 'long'
  if (item.par !== null && item.quantity < item.par) return 'low'
  if (item.storage_class === 'surplus' || (item.par !== null && item.quantity >= item.par * 2)) return 'surplus'
  return 'ok'
}

export const useHouseStore = defineStore('house', () => {
  const locations = ref([])
  const items = ref([])
  const types = ref([])
  const loading = ref(false)
  const error = ref(null)
  /** Last failed save, kept apart from `error` so a failed PATCH doesn't blank the page. */
  const saveError = ref(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      if (useApi) {
        const [residences, areas, spots, apiItems, apiTypes] = await Promise.all([
          api.residences(),
          api.areas(),
          api.spots(),
          api.items(),
          api.types(),
        ])
        const residence = residences[0]
        if (!residence) throw new Error('No residence yet. Add one in the Django admin.')
        const data = adapt(residence, areas, spots, apiItems)
        locations.value = data.locations
        items.value = data.items
        types.value = apiTypes
      } else {
        locations.value = deriveKinds(structuredClone(mockLocations))
        items.value = structuredClone(mockItems)
        types.value = structuredClone(mockTypes)
      }
    } catch (exception) {
      error.value = exception instanceof Error ? exception.message : String(exception)
    } finally {
      loading.value = false
    }
  }

  // ---- tree lookups ----
  const byId = computed(() => new Map(locations.value.map((place) => [place.id, place])))
  const childMap = computed(() => {
    const byParent = new Map()
    for (const place of locations.value) if (place.parent) byParent.set(place.parent, [...(byParent.get(place.parent) ?? []), place])
    return byParent
  })
  const house = computed(() => locations.value.find((place) => place.kind === 'house'))
  const location = (id) => byId.value.get(id)
  const children = (id) => childMap.value.get(id) ?? []
  const rooms = computed(() => (house.value ? children(house.value.id) : []))
  const item = (id) => items.value.find((candidate) => candidate.id === id)

  function subtree(id) {
    const out = new Set([id])
    for (const child of children(id)) for (const descendant of subtree(child.id)) out.add(descendant)
    return out
  }
  const itemsIn = (id, deep = true) => {
    const ids = deep ? subtree(id) : new Set([id])
    return items.value.filter((record) => ids.has(record.location))
  }

  /** From the room down, excluding the house. */
  function ancestry(id) {
    const out = []
    for (let place = location(id); place && place.kind !== 'house'; place = place.parent ? location(place.parent) : undefined) out.unshift(place)
    return out
  }
  const roomOf = (id) => ancestry(id)[0]

  /** Breadcrumbs that link each level into its room view. */
  function crumbs(id, withHouse = true) {
    const path = ancestry(id)
    const room = path[0]
    const list = path.map((place) => ({
      label: place.name,
      to: place.kind === 'room' ? `/rooms/${place.id}` : room ? { path: `/rooms/${room.id}`, query: place.kind === 'container' ? { in: place.id } : {} } : undefined,
    }))
    return withHouse ? [{ label: house.value?.name ?? 'House', to: '/' }, ...list] : list
  }

  /** "Hall closet / Drawer B": skips furniture that only groups containers. */
  const pathText = (id) =>
    ancestry(id)
      .filter((place) => place.kind !== 'furniture' || children(place.id).length === 0)
      .map((place) => place.name)
      .join(' / ')

  // ---- status ----
  const byStatus = (wanted) => computed(() => items.value.filter((record) => status(record) === wanted))
  const lowItems = byStatus('low')
  const surplusItems = byStatus('surplus')
  const longTermItems = byStatus('long')

  function countsFor(id) {
    const list = itemsIn(id)
    return {
      total: list.length,
      low: list.filter((record) => status(record) === 'low').length,
      surplus: list.filter((record) => status(record) === 'surplus').length,
    }
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
  )

  /** Everything with a printable code, or any container, for the Labels page. */
  const labelled = computed(() => locations.value.filter((place) => place.code || place.kind === 'container' || place.kind === 'slot'))

  /** A location by its printed code (case-insensitive), falling back to an exact name. */
  function findByCode(query) {
    const term = query.trim().toLowerCase()
    if (!term) return undefined
    return (
      locations.value.find((place) => place.code?.toLowerCase() === term) ??
      locations.value.find((place) => place.kind !== 'house' && place.name.toLowerCase() === term)
    )
  }

  // ---- actions ----
  const fail = (exception) => (saveError.value = exception instanceof Error ? exception.message : String(exception))
  const today = () => new Date().toISOString().slice(0, 10)

  async function setQuantity(id, quantity) {
    const record = item(id)
    if (!record) return
    const previous = record.quantity
    record.quantity = quantity // optimistic
    if (!useApi) return
    try {
      await api.updateItem(id, { count: quantity })
      saveError.value = null
    } catch (exception) {
      record.quantity = previous
      fail(exception)
    }
  }

  async function addItem(draft) {
    const local = {
      id: `${slug(draft.name)}-${Math.random().toString(36).slice(2, 7)}`,
      history: [{ date: today(), text: `Added ${draft.quantity}` }],
      ...draft,
    }
    if (!useApi) {
      items.value = [...items.value, local]
      return local
    }
    try {
      const created = await api.createItem(toApi(draft))
      const saved = { ...local, id: created.id }
      items.value = [...items.value, saved]
      saveError.value = null
      return saved
    } catch (exception) {
      fail(exception)
    }
  }

  async function updateItem(id, draft) {
    const record = item(id)
    if (!record) return
    const before = { ...record }
    const moved = draft.location !== record.location
    Object.assign(record, draft)
    if (moved) recordMove(record, before.location)
    if (!useApi) return
    try {
      await api.updateItem(id, toApi(draft))
      saveError.value = null
    } catch (exception) {
      Object.assign(record, before)
      fail(exception)
    }
  }

  function recordMove(record, from) {
    record.moved_from = pathText(from)
    record.history = [{ date: today(), text: `Moved to ${pathText(record.location)}` }, ...record.history]
  }

  async function moveItem(id, to) {
    const record = item(id)
    if (!record || record.location === to) return
    const before = { location: record.location, moved_from: record.moved_from, history: record.history }
    record.location = to
    recordMove(record, before.location)
    if (!useApi) return
    try {
      await api.updateItem(id, { storage_spot: to })
      saveError.value = null
    } catch (exception) {
      Object.assign(record, before)
      fail(exception)
    }
  }

  /** Removes an item and returns a function that puts it back (for Undo). */
  async function removeItem(id) {
    const record = item(id)
    if (!record) return
    const index = items.value.indexOf(record)
    items.value = items.value.filter((other) => other.id !== id)
    const wasListed = shopping.value.includes(id)
    shopping.value = shopping.value.filter((listedId) => listedId !== id)
    const restore = async () => {
      if (useApi) {
        // The API gives a re-created item a new id.
        const created = await api.createItem(toApi(record)).catch((exception) => (fail(exception), undefined))
        if (!created) return
        record.id = created.id
      }
      const next = [...items.value]
      next.splice(Math.min(index, next.length), 0, record)
      items.value = next
      if (wasListed) shopping.value = [...shopping.value, record.id]
    }
    if (!useApi) return restore
    try {
      await api.deleteItem(id)
      saveError.value = null
      return restore
    } catch (exception) {
      items.value.splice(index, 0, record)
      fail(exception)
    }
  }

  // ---- rooms, storage spots and storage types ----
  const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`
  const typeName = (id) => types.value.find((storageType) => storageType.id === id)?.name
  const typeUsage = (id) => locations.value.filter((place) => place.type === id).length
  /** Ids at or below `id`, for keeping a spot from being moved inside itself. */
  const descendants = (id) => subtree(id)
  /** What removing a place would take with it. */
  const contentsOf = (id) => ({ items: itemsIn(id).length, places: subtree(id).size - 1 })

  async function addRoom(draft) {
    const home = house.value
    if (!home) return
    const room = { id: newId('room'), name: draft.name, kind: 'room', parent: home.id, note: draft.note }
    if (useApi) {
      try {
        room.id = (await api.createArea({ name: draft.name, description: draft.note ?? '', residence: home.id })).id
        saveError.value = null
      } catch (exception) {
        return void fail(exception)
      }
    }
    locations.value = [...locations.value, room]
    return room
  }

  async function updateRoom(id, draft) {
    const room = location(id)
    if (!room) return
    const before = { name: room.name, note: room.note }
    Object.assign(room, { name: draft.name, note: draft.note })
    if (!useApi) return
    try {
      await api.updateArea(id, { name: draft.name, description: draft.note ?? '' })
      saveError.value = null
    } catch (exception) {
      Object.assign(room, before)
      fail(exception)
    }
  }

  /** The API's view of a spot's parent: null when it sits directly in a room. */
  function spotApiFields(draft) {
    const parent = location(draft.parent)
    const room = parent?.kind === 'room' ? parent : roomOf(draft.parent)
    return { parent: parent?.kind === 'room' ? null : draft.parent, storage_area: room?.id ?? draft.parent }
  }

  async function addSpot(draft) {
    const spot = { id: newId('spot'), name: draft.name, kind: 'container', parent: draft.parent, type: draft.type, code: draft.code, note: draft.note }
    if (useApi) {
      try {
        spot.id = (await api.createSpot({ name: draft.name, storage_type: draft.type, description: draft.note ?? '', ...spotApiFields(draft) })).id
        saveError.value = null
      } catch (exception) {
        return void fail(exception)
      }
    }
    locations.value = deriveKinds([...locations.value, spot])
    return spot
  }

  async function updateSpot(id, draft) {
    const spot = location(id)
    if (!spot || descendants(id).has(draft.parent)) return
    const before = { name: spot.name, parent: spot.parent, type: spot.type, code: spot.code, note: spot.note }
    Object.assign(spot, { name: draft.name, parent: draft.parent, type: draft.type, code: draft.code, note: draft.note })
    deriveKinds(locations.value)
    if (!useApi) return
    try {
      await api.updateSpot(id, { name: draft.name, storage_type: draft.type, description: draft.note ?? '', ...spotApiFields(draft) })
      saveError.value = null
    } catch (exception) {
      Object.assign(spot, before)
      deriveKinds(locations.value)
      fail(exception)
    }
  }

  /**
   * Removes a room or spot and everything inside it. Refused while items are inside:
   * the API would leave them with no spot, and they'd drop out of the app.
   */
  async function removePlace(id) {
    const place = location(id)
    if (!place || place.kind === 'house') return false
    const held = contentsOf(id).items
    if (held) {
      saveError.value = `${place.name} still holds ${held} ${held === 1 ? 'item' : 'items'}. Move or remove them first.`
      return false
    }
    if (useApi) {
      try {
        await (place.kind === 'room' ? api.deleteArea(id) : api.deleteSpot(id))
        saveError.value = null
      } catch (exception) {
        fail(exception)
        return false
      }
    }
    const gone = subtree(id)
    locations.value = deriveKinds(locations.value.filter((remaining) => !gone.has(remaining.id)))
    return true
  }

  async function addType(name) {
    const clean = name.trim()
    if (!clean) return
    const existing = types.value.find((storageType) => storageType.name.toLowerCase() === clean.toLowerCase())
    if (existing) return existing
    const type = { id: newId('type'), name: clean }
    if (useApi) {
      try {
        type.id = (await api.createType(clean)).id
        saveError.value = null
      } catch (exception) {
        return void fail(exception)
      }
    }
    types.value = [...types.value, type].sort((left, right) => left.name.localeCompare(right.name))
    return type
  }

  async function renameType(id, name) {
    const storageType = types.value.find((candidate) => candidate.id === id)
    const clean = name.trim()
    if (!storageType || !clean || clean === storageType.name) return
    const before = storageType.name
    storageType.name = clean
    if (!useApi) return
    try {
      await api.updateType(id, clean)
      saveError.value = null
    } catch (exception) {
      storageType.name = before
      fail(exception)
    }
  }

  async function removeType(id) {
    const used = typeUsage(id)
    if (used) {
      saveError.value = `${used} ${used === 1 ? 'place uses' : 'places use'} this type. Change them first.`
      return false
    }
    if (useApi) {
      try {
        await api.deleteType(id)
        saveError.value = null
      } catch (exception) {
        fail(exception)
        return false
      }
    }
    types.value = types.value.filter((storageType) => storageType.id !== id)
    return true
  }

  // ---- shopping list (kept in this browser until the API has lists) ----
  const shopping = ref(readList())
  watch(shopping, (ids) => {
    try {
      localStorage.setItem(LIST_KEY, JSON.stringify(ids))
    } catch {
      /* storage blocked: the list lasts for this visit */
    }
  })
  const shoppingItems = computed(() => shopping.value.map((id) => item(id)).filter(Boolean))
  const onList = (id) => shopping.value.includes(id)
  function toggleList(id) {
    shopping.value = onList(id) ? shopping.value.filter((listedId) => listedId !== id) : [...shopping.value, id]
  }
  /** Marks a listed item bought: restocks it to par (or by one with no par) and takes it off the list. */
  async function markBought(id) {
    const record = item(id)
    if (!record) return
    const before = record.quantity
    const target = record.par !== null ? Math.max(record.par, record.quantity + 1) : record.quantity + 1
    shopping.value = shopping.value.filter((listedId) => listedId !== id)
    record.history = [{ date: today(), text: `Restocked to ${target}` }, ...record.history]
    await setQuantity(id, target)
    return async () => {
      record.history = record.history.slice(1)
      await setQuantity(id, before)
      shopping.value = [...shopping.value, id]
    }
  }

  function search(query) {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return items.value.filter((record) => `${record.name} ${pathText(record.location)} ${record.used_for ?? ''}`.toLowerCase().includes(term))
  }

  return {
    locations, items, types, loading, error, saveError, house, rooms, lowItems, surplusItems, longTermItems, places, labelled,
    shopping, shoppingItems,
    typeName, typeUsage, descendants, contentsOf, addRoom, updateRoom, addSpot, updateSpot, removePlace, addType, renameType, removeType,
    load, location, children, item, itemsIn, ancestry, roomOf, crumbs, pathText, countsFor, findByCode, search,
    setQuantity, addItem, updateItem, moveItem, removeItem, onList, toggleList, markBought,
  }
})
