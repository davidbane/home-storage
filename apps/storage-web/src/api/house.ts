import { computed, reactive } from 'vue'
import type { Crumb, Status } from '@home/ui'
import type { Item, Location } from './types'
import { items as mockItems, locations as mockLocations } from './mock'

// The app's single data store. Today it holds mock data; swap `load()` for
// fetches to the DRF API (VITE_API_URL) without changing the views.
const state = reactive({
  locations: [] as Location[],
  items: [] as Item[],
})

export function load() {
  state.locations = structuredClone(mockLocations)
  state.items = structuredClone(mockItems)
}
load()

const byId = computed(() => new Map(state.locations.map((l) => [l.id, l])))
const childMap = computed(() => {
  const m = new Map<string, Location[]>()
  for (const l of state.locations) if (l.parent) m.set(l.parent, [...(m.get(l.parent) ?? []), l])
  return m
})

export const location = (id: string) => byId.value.get(id)
export const children = (id: string) => childMap.value.get(id) ?? []
export const rooms = computed(() => children('house'))
export const item = (id: string) => state.items.find((i) => i.id === id)
export const allItems = computed(() => state.items)

/** Every location id at or below `id`. */
function subtree(id: string): Set<string> {
  const out = new Set([id])
  for (const c of children(id)) for (const d of subtree(c.id)) out.add(d)
  return out
}

export const itemsIn = (id: string, deep = true) => {
  const ids = deep ? subtree(id) : new Set([id])
  return state.items.filter((i) => ids.has(i.location))
}

/** Location ids from the room down, excluding the house. */
export function ancestry(id: string): Location[] {
  const out: Location[] = []
  for (let l = location(id); l && l.kind !== 'house'; l = l.parent ? location(l.parent) : undefined) out.unshift(l)
  return out
}

export const roomOf = (id: string) => ancestry(id)[0]

/** Breadcrumbs that link each level into its room view. */
export function crumbs(id: string, withHouse = true): Crumb[] {
  const path = ancestry(id)
  const room = path[0]
  const list: Crumb[] = path.map((l) => ({
    label: l.name,
    to: l.kind === 'room' ? `/rooms/${l.id}` : room ? { path: `/rooms/${room.id}`, query: l.kind === 'container' ? { in: l.id } : {} } : undefined,
  }))
  return withHouse ? [{ label: 'House', to: '/' }, ...list] : list
}

/** The path as plain text, from the room down: "Hall closet / Drawer B". */
export const pathText = (id: string) =>
  ancestry(id)
    .filter((l) => l.kind !== 'furniture' || children(l.id).length === 0)
    .map((l) => l.name)
    .join(' / ')

/**
 * Domain rule for the four statuses:
 * long-term storage class → Long-term; under par → Low;
 * surplus storage class or at least double par → Surplus; else Stocked.
 */
export function status(i: Item): Status {
  if (i.storage_class === 'long_term') return 'long'
  if (i.par !== null && i.quantity < i.par) return 'low'
  if (i.storage_class === 'surplus' || (i.par !== null && i.quantity >= i.par * 2)) return 'surplus'
  return 'ok'
}

export const lowItems = computed(() => state.items.filter((i) => status(i) === 'low'))
export const surplusItems = computed(() => state.items.filter((i) => status(i) === 'surplus'))
export const longTermItems = computed(() => state.items.filter((i) => status(i) === 'long'))

export function countsFor(id: string) {
  const list = itemsIn(id)
  const low = list.filter((i) => status(i) === 'low').length
  const surplus = list.filter((i) => status(i) === 'surplus').length
  return { total: list.length, low, surplus }
}

export function setQuantity(id: string, quantity: number) {
  const i = item(id)
  if (i) i.quantity = quantity
  // TODO(api): PATCH `${import.meta.env.VITE_API_URL}/items/${id}/` { quantity }
}

export function search(q: string) {
  const term = q.trim().toLowerCase()
  if (!term) return []
  return state.items.filter((i) => `${i.name} ${pathText(i.location)} ${i.used_for ?? ''}`.toLowerCase().includes(term))
}
