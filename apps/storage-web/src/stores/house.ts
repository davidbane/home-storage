import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Crumb, Status } from '@home/ui'
import type { Item, ItemDraft, Location } from '@/models'
import { api, type ApiItemWrite } from '@/api/endpoints'
import { adapt } from '@/api/adapt'
import { items as mockItems, locations as mockLocations } from '@/api/mock'

/** VITE_DATA_SOURCE=api reads the DRF backend; anything else uses the sample data. */
const useApi = import.meta.env.VITE_DATA_SOURCE === 'api'

const LIST_KEY = 'home-storage:shopping'
function readList(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LIST_KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'

/** The fields the API knows today. Par, storage class and history stay client-side until it has them. */
const toApi = (d: ItemDraft): ApiItemWrite => ({
  name: d.name,
  brand: d.brand ?? '',
  count: d.quantity,
  description: d.used_for ?? '',
  storage_spot: d.location,
})

/**
 * The four statuses, decided here rather than in components:
 * long-term storage class → Long-term; under par → Low;
 * surplus storage class or at least double par → Surplus; else Stocked.
 */
export function status(i: Item): Status {
  if (i.storage_class === 'long_term') return 'long'
  if (i.par !== null && i.quantity < i.par) return 'low'
  if (i.storage_class === 'surplus' || (i.par !== null && i.quantity >= i.par * 2)) return 'surplus'
  return 'ok'
}

export const useHouseStore = defineStore('house', () => {
  const locations = ref<Location[]>([])
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  /** Last failed save, kept apart from `error` so a failed PATCH doesn't blank the page. */
  const saveError = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      if (useApi) {
        const [residences, areas, spots, apiItems] = await Promise.all([api.residences(), api.areas(), api.spots(), api.items()])
        const residence = residences[0]
        if (!residence) throw new Error('No residence yet. Add one in the Django admin.')
        const data = adapt(residence, areas, spots, apiItems)
        locations.value = data.locations
        items.value = data.items
      } else {
        locations.value = structuredClone(mockLocations)
        items.value = structuredClone(mockItems)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  // ---- tree lookups ----
  const byId = computed(() => new Map(locations.value.map((l) => [l.id, l])))
  const childMap = computed(() => {
    const m = new Map<string, Location[]>()
    for (const l of locations.value) if (l.parent) m.set(l.parent, [...(m.get(l.parent) ?? []), l])
    return m
  })
  const house = computed(() => locations.value.find((l) => l.kind === 'house'))
  const location = (id: string) => byId.value.get(id)
  const children = (id: string) => childMap.value.get(id) ?? []
  const rooms = computed(() => (house.value ? children(house.value.id) : []))
  const item = (id: string) => items.value.find((i) => i.id === id)

  function subtree(id: string): Set<string> {
    const out = new Set([id])
    for (const c of children(id)) for (const d of subtree(c.id)) out.add(d)
    return out
  }
  const itemsIn = (id: string, deep = true) => {
    const ids = deep ? subtree(id) : new Set([id])
    return items.value.filter((i) => ids.has(i.location))
  }

  /** From the room down, excluding the house. */
  function ancestry(id: string): Location[] {
    const out: Location[] = []
    for (let l = location(id); l && l.kind !== 'house'; l = l.parent ? location(l.parent) : undefined) out.unshift(l)
    return out
  }
  const roomOf = (id: string) => ancestry(id)[0]

  /** Breadcrumbs that link each level into its room view. */
  function crumbs(id: string, withHouse = true): Crumb[] {
    const path = ancestry(id)
    const room = path[0]
    const list: Crumb[] = path.map((l) => ({
      label: l.name,
      to: l.kind === 'room' ? `/rooms/${l.id}` : room ? { path: `/rooms/${room.id}`, query: l.kind === 'container' ? { in: l.id } : {} } : undefined,
    }))
    return withHouse ? [{ label: house.value?.name ?? 'House', to: '/' }, ...list] : list
  }

  /** "Hall closet / Drawer B": skips furniture that only groups containers. */
  const pathText = (id: string) =>
    ancestry(id)
      .filter((l) => l.kind !== 'furniture' || children(l.id).length === 0)
      .map((l) => l.name)
      .join(' / ')

  // ---- status ----
  const byStatus = (s: Status) => computed(() => items.value.filter((i) => status(i) === s))
  const lowItems = byStatus('low')
  const surplusItems = byStatus('surplus')
  const longTermItems = byStatus('long')

  function countsFor(id: string) {
    const list = itemsIn(id)
    return {
      total: list.length,
      low: list.filter((i) => status(i) === 'low').length,
      surplus: list.filter((i) => status(i) === 'surplus').length,
    }
  }

  /** Every place an item can sit, grouped by room, labelled by its path inside the room. */
  const places = computed(() =>
    rooms.value.map((room) => ({
      room,
      options: [...subtree(room.id)]
        .filter((id) => id !== room.id)
        .map((id) => location(id)!)
        .map((l) => ({ id: l.id, label: ancestry(l.id).slice(1).map((a) => a.name).join(' / ') }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    })),
  )

  /** Everything with a printable code, or any container, for the Labels page. */
  const labelled = computed(() => locations.value.filter((l) => l.code || l.kind === 'container' || l.kind === 'slot'))

  /** A location by its printed code (case-insensitive), falling back to an exact name. */
  function findByCode(q: string) {
    const term = q.trim().toLowerCase()
    if (!term) return undefined
    return (
      locations.value.find((l) => l.code?.toLowerCase() === term) ??
      locations.value.find((l) => l.kind !== 'house' && l.name.toLowerCase() === term)
    )
  }

  // ---- actions ----
  const fail = (e: unknown) => (saveError.value = e instanceof Error ? e.message : String(e))
  const today = () => new Date().toISOString().slice(0, 10)

  async function setQuantity(id: string, quantity: number) {
    const i = item(id)
    if (!i) return
    const previous = i.quantity
    i.quantity = quantity // optimistic
    if (!useApi) return
    try {
      await api.updateItem(id, { count: quantity })
      saveError.value = null
    } catch (e) {
      i.quantity = previous
      fail(e)
    }
  }

  async function addItem(draft: ItemDraft): Promise<Item | undefined> {
    const local: Item = {
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
    } catch (e) {
      fail(e)
    }
  }

  async function updateItem(id: string, draft: ItemDraft) {
    const i = item(id)
    if (!i) return
    const before = { ...i }
    const moved = draft.location !== i.location
    Object.assign(i, draft)
    if (moved) recordMove(i, before.location)
    if (!useApi) return
    try {
      await api.updateItem(id, toApi(draft))
      saveError.value = null
    } catch (e) {
      Object.assign(i, before)
      fail(e)
    }
  }

  function recordMove(i: Item, from: string) {
    i.moved_from = pathText(from)
    i.history = [{ date: today(), text: `Moved to ${pathText(i.location)}` }, ...i.history]
  }

  async function moveItem(id: string, to: string) {
    const i = item(id)
    if (!i || i.location === to) return
    const before = { location: i.location, moved_from: i.moved_from, history: i.history }
    i.location = to
    recordMove(i, before.location)
    if (!useApi) return
    try {
      await api.updateItem(id, { storage_spot: to })
      saveError.value = null
    } catch (e) {
      Object.assign(i, before)
      fail(e)
    }
  }

  /** Removes an item and returns a function that puts it back (for Undo). */
  async function removeItem(id: string): Promise<(() => Promise<void>) | undefined> {
    const i = item(id)
    if (!i) return
    const index = items.value.indexOf(i)
    items.value = items.value.filter((x) => x.id !== id)
    const wasListed = shopping.value.includes(id)
    shopping.value = shopping.value.filter((x) => x !== id)
    const restore = async () => {
      if (useApi) {
        // The API gives a re-created item a new id.
        const created = await api.createItem(toApi(i)).catch((e) => (fail(e), undefined))
        if (!created) return
        i.id = created.id
      }
      const next = [...items.value]
      next.splice(Math.min(index, next.length), 0, i)
      items.value = next
      if (wasListed) shopping.value = [...shopping.value, i.id]
    }
    if (!useApi) return restore
    try {
      await api.deleteItem(id)
      saveError.value = null
      return restore
    } catch (e) {
      items.value.splice(index, 0, i)
      fail(e)
    }
  }

  // ---- shopping list (kept in this browser until the API has lists) ----
  const shopping = ref<string[]>(readList())
  watch(shopping, (ids) => {
    try {
      localStorage.setItem(LIST_KEY, JSON.stringify(ids))
    } catch {
      /* storage blocked: the list lasts for this visit */
    }
  })
  const shoppingItems = computed(() => shopping.value.map((id) => item(id)).filter((i): i is Item => Boolean(i)))
  const onList = (id: string) => shopping.value.includes(id)
  function toggleList(id: string) {
    shopping.value = onList(id) ? shopping.value.filter((x) => x !== id) : [...shopping.value, id]
  }
  /** Marks a listed item bought: restocks it to par (or by one with no par) and takes it off the list. */
  async function markBought(id: string) {
    const i = item(id)
    if (!i) return
    const before = i.quantity
    const target = i.par !== null ? Math.max(i.par, i.quantity + 1) : i.quantity + 1
    shopping.value = shopping.value.filter((x) => x !== id)
    i.history = [{ date: today(), text: `Restocked to ${target}` }, ...i.history]
    await setQuantity(id, target)
    return async () => {
      i.history = i.history.slice(1)
      await setQuantity(id, before)
      shopping.value = [...shopping.value, id]
    }
  }

  function search(q: string) {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return items.value.filter((i) => `${i.name} ${pathText(i.location)} ${i.used_for ?? ''}`.toLowerCase().includes(term))
  }

  return {
    locations, items, loading, error, saveError, house, rooms, lowItems, surplusItems, longTermItems, places, labelled,
    shopping, shoppingItems,
    load, location, children, item, itemsIn, ancestry, roomOf, crumbs, pathText, countsFor, findByCode, search,
    setQuantity, addItem, updateItem, moveItem, removeItem, onList, toggleList, markBought,
  }
})
