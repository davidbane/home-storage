<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconArrowLeft, IconPlus, IconPrinter } from '@tabler/icons-vue'
import {
  ApBinTag, ApBreadcrumb, ApButton, ApContainer, ApDock, ApIconButton, ApList, ApListRow,
  ApLocationTile, ApPageHead, ApSection, ApSplit, ApStatusChip, ApTileGrid, useIsDesktop,
} from '@home/ui'
import ItemDetail from '@/components/ItemDetail.vue'
import { status, useHouseStore } from '@/stores/house'

const house = useHouseStore()
const route = useRoute()
const router = useRouter()
const isDesktop = useIsDesktop()

const room = computed(() => house.location(String(route.params.roomId)))
const furniture = computed(() => (room.value ? house.children(room.value.id) : []))
const containers = computed(() => furniture.value.flatMap((f) => (house.children(f.id).length ? house.children(f.id) : [f])))

// ?in= selects a container (default: the first with something low, else the first).
const selectedId = computed(() => {
  const q = route.query.in
  if (typeof q === 'string' && containers.value.some((c) => c.id === q)) return q
  return (containers.value.find((c) => house.countsFor(c.id).low) ?? containers.value[0])?.id
})
const selected = computed(() => (selectedId.value ? house.location(selectedId.value) : undefined))
const contents = computed(() => (selectedId.value ? house.itemsIn(selectedId.value, false) : []))

// ?item= opens an item: a pane on desktop, its own screen on phones. Same URL either way.
const itemId = computed(() => (typeof route.query.item === 'string' && house.item(route.query.item) ? route.query.item : undefined))
const openItem = computed(() => (itemId.value ? house.item(itemId.value) : undefined))
const showItemScreen = computed(() => Boolean(openItem.value) && !isDesktop.value)

const roomCounts = computed(() => (room.value ? house.countsFor(room.value.id) : { total: 0, low: 0, surplus: 0 }))
const summary = computed(() => {
  const c = roomCounts.value
  return [`${c.total} items`, c.low && `${c.low} low`, c.surplus && `${c.surplus} surplus`].filter(Boolean).join(' · ')
})
const withQuery = (q: Record<string, string | undefined>) => ({ query: { ...route.query, ...q } })
const closeItem = () => router.replace(withQuery({ item: undefined }))
const tileMeta = (id: string, note?: string) => {
  const c = house.countsFor(id)
  if (c.low) return { meta: `${c.low} low`, tone: 'alert' as const }
  if (c.total === 0) return { meta: 'empty', tone: 'muted' as const }
  return { meta: note, tone: 'muted' as const }
}
</script>

<template>
  <ApContainer v-if="room">
    <!-- Phone item screen: the same item, as its own page. -->
    <template v-if="showItemScreen && openItem">
      <ApPageHead :title="openItem.name">
        <template #back>
          <ApIconButton label="Back" :to="withQuery({ item: undefined })"><IconArrowLeft :size="20" :stroke="1.5" aria-hidden="true" /></ApIconButton>
        </template>
        <template #eyebrow><ApBreadcrumb :items="house.crumbs(openItem.location)" /></template>
        <template #meta>
          <div class="flex flex-wrap items-center gap-2">
            <ApStatusChip :status="status(openItem)" />
            <ApBinTag v-if="house.location(openItem.location)?.code" :code="house.location(openItem.location)!.code!" :label="house.location(openItem.location)!.name" />
          </div>
        </template>
      </ApPageHead>
      <ItemDetail :item-id="openItem.id" variant="body" />
      <ApDock>
        <ApButton class="flex-1">Move</ApButton>
        <ApButton variant="primary" class="flex-2">Add to shopping list</ApButton>
      </ApDock>
    </template>

    <template v-else>
      <ApPageHead :title="room.name">
        <template #back>
          <ApIconButton label="Back" to="/"><IconArrowLeft :size="20" :stroke="1.5" aria-hidden="true" /></ApIconButton>
        </template>
        <template #eyebrow><ApBreadcrumb :items="house.crumbs(room.id)" current /></template>
        <template #meta>
          <div class="flex flex-wrap items-center gap-2.5">
            <ApBinTag v-for="f in furniture.filter((x) => x.code)" :key="f.id" :code="f.code!" :label="f.note ?? f.name" />
            <span class="type-meta text-ink-muted">{{ summary }}</span>
          </div>
        </template>
        <template #actions>
          <div class="hidden gap-3 md:flex">
            <ApButton><template #icon><IconPrinter :size="18" :stroke="1.5" aria-hidden="true" /></template>Print labels</ApButton>
            <ApButton v-if="selected"><template #icon><IconPlus :size="18" :stroke="1.75" aria-hidden="true" /></template>Add to {{ selected.name }}</ApButton>
          </div>
        </template>
      </ApPageHead>

      <ApSplit>
        <ApSection v-for="f in furniture" :key="f.id" :title="f.name">
          <ApTileGrid :columns="house.children(f.id).length === 6 || house.children(f.id).length === 3 ? 3 : undefined">
            <ApLocationTile
              v-for="c in house.children(f.id).length ? house.children(f.id) : [f]"
              :key="c.id"
              :name="c.name"
              :count="house.countsFor(c.id).total"
              :meta="tileMeta(c.id, c.note).meta"
              :meta-tone="tileMeta(c.id, c.note).tone"
              :selected="c.id === selectedId"
              :to="withQuery({ in: c.id, item: undefined })"
              replace
            />
          </ApTileGrid>
        </ApSection>

        <ApSection v-if="selected" :title="`In ${selected.name}`">
          <template #aside><span v-if="selected.code" class="type-code text-ink-muted">{{ selected.code }}</span></template>
          <ApList v-if="contents.length">
            <ApListRow
              v-for="i in contents"
              :key="i.id"
              :name="i.name"
              :sub="i.par !== null ? `Par ${i.par}` : i.used_for"
              :status="status(i)"
              :qty="i.quantity"
              :selected="isDesktop && i.id === itemId"
              :to="withQuery({ item: i.id })"
            />
          </ApList>
          <p v-else class="m-0 rounded-md bg-surface-1 px-4 py-5 text-[15px] text-ink-muted shadow-raised">Nothing here yet.</p>
        </ApSection>

        <template v-if="openItem" #pane>
          <ItemDetail :item-id="openItem.id" variant="pane" @close="closeItem" />
        </template>
      </ApSplit>

      <ApDock>
        <ApButton class="flex-1"><template #icon><IconPrinter :size="18" :stroke="1.5" aria-hidden="true" /></template>Print label</ApButton>
        <ApButton v-if="selected" variant="primary" class="flex-[1.4]"><template #icon><IconPlus :size="18" :stroke="1.75" aria-hidden="true" /></template>Add to {{ selected.name }}</ApButton>
      </ApDock>
    </template>
  </ApContainer>
  <ApContainer v-else>
    <ApPageHead title="Room not found" />
    <ApButton to="/">Back to the house</ApButton>
  </ApContainer>
</template>
