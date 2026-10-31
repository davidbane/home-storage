import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Crumb, Status } from '@home/ui'
import type { Item, Location } from '@/models'
import { api } from '@/api/endpoints'
import { adapt } from '@/api/adapt'
import { items as mockItems, locations as mockLocations } from '@/api/mock'

/** VITE_DATA_SOURCE=api reads the DRF backend; anything else uses the sample data. */
const useApi = import.meta.env.VITE_DATA_SOURCE === 'api'

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

  // ---- actions ----
  async function setQuantity(id: string, quantity: number) {
    const i = item(id)
    if (!i) return
    const previous = i.quantity
    i.quantity = quantity // optimistic
    if (!useApi) return
    try {
      await api.setItemCount(id, quantity)
      saveError.value = null
    } catch (e) {
      i.quantity = previous
      saveError.value = e instanceof Error ? e.message : String(e)
    }
  }

  function search(q: string) {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return items.value.filter((i) => `${i.name} ${pathText(i.location)} ${i.used_for ?? ''}`.toLowerCase().includes(term))
  }

  return {
    locations, items, loading, error, saveError, house, rooms, lowItems, surplusItems, longTermItems,
    load, location, children, item, itemsIn, ancestry, roomOf, crumbs, pathText, countsFor, setQuantity, search,
  }
})
