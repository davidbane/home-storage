<script setup>
import { computed, ref } from 'vue'
import { IconPlus, IconScan, IconSettings } from '@tabler/icons-vue'
import {
  ApButton, ApContainer, ApFeature, ApIconButton, ApList, ApListRow, ApLocationTile,
  ApPageHead, ApSearchField, ApSection, ApStat, ApTileGrid,
} from '@home/ui'
import { status, useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
const q = ref('')
const results = computed(() => house.search(q.value))
const attention = computed(() => [...house.lowItems, ...house.surplusItems].slice(0, 4))

const greeting = computed(() => {
  const h = new Date().getHours()
  const day = new Date().toLocaleDateString(undefined, { weekday: 'long' })
  return `${day} ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}`
})
const linkFor = (i) => ({ path: `/rooms/${house.roomOf(i.location)?.id}`, query: { in: i.location, item: i.id } })
const tileMeta = (id) => {
  const c = house.countsFor(id)
  return c.low ? { meta: `${c.low} low`, tone: 'alert' } : c.surplus ? { meta: `${c.surplus} surplus`, tone: 'muted' } : { meta: 'all stocked', tone: 'muted' }
}
</script>

<template>
  <ApContainer>
    <ApPageHead :title="house.house?.name ?? 'The House'">
      <template #eyebrow>
        <div class="flex items-center gap-2">
          <span class="flex-1 text-[13px] leading-[18px] font-medium text-ink-muted">{{ greeting }}</span>
          <div class="flex gap-2 md:hidden">
            <ApIconButton label="Settings" to="/settings"><IconSettings :size="20" stroke="1.5" aria-hidden="true" /></ApIconButton>
            <ApIconButton label="Find a bin by its label code" @click="ui.openFind()"><IconScan :size="20" stroke="1.5" aria-hidden="true" /></ApIconButton>
          </div>
        </div>
      </template>
      <template #actions>
        <ApSearchField v-model="q" shortcut class="max-w-105 flex-1" />
        <ApIconButton label="Find a bin by its label code" size="lg" class="hidden! md:inline-flex!" @click="ui.openFind()"><IconScan :size="20" stroke="1.5" aria-hidden="true" /></ApIconButton>
        <ApButton variant="primary" class="hidden! md:inline-flex!" @click="ui.openAdd()"><template #icon><IconPlus :size="18" stroke="1.75" aria-hidden="true" /></template>Add item</ApButton>
      </template>
    </ApPageHead>

    <div v-if="q.trim()" class="flex flex-col gap-3">
      <p class="m-0 type-meta text-ink-muted">{{ results.length }} {{ results.length === 1 ? 'match' : 'matches' }} for “{{ q.trim() }}”</p>
      <ApList v-if="results.length" label="Search results">
        <ApListRow v-for="i in results" :key="i.id" :name="i.name" :sub="house.pathText(i.location)" :status="status(i)" :qty="i.quantity" :to="linkFor(i)" />
      </ApList>
      <p v-else class="m-0 text-[15px] text-ink-muted">No match. Try a room name, or browse below.</p>
    </div>

    <div v-else class="flex flex-col gap-6 md:gap-10">
      <ApFeature aria-label="Summary" class="grid grid-cols-3 gap-x-6 gap-y-4 md:grid-cols-4">
        <ApStat :value="house.items.length" label="items filed" />
        <ApStat :value="house.lowItems.length" label="running low" />
        <ApStat :value="house.surplusItems.length" label="in surplus" class="hidden md:flex" />
        <ApStat :value="house.rooms.length" label="rooms" class="md:hidden" />
        <ApStat :value="house.longTermItems.length" label="long-term" class="hidden md:flex" />
      </ApFeature>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <ApSection title="Needs attention" link-label="See all" link-to="/low">
          <ApList>
            <ApListRow v-for="i in attention" :key="i.id" :name="i.name" :sub="house.pathText(i.location)" :status="status(i)" :qty="i.quantity" :to="linkFor(i)" />
          </ApList>
        </ApSection>
        <ApSection title="Recently moved" class="hidden md:flex">
          <ApList>
            <ApListRow v-for="i in house.items.filter((x) => x.moved_from)" :key="i.id" :name="i.name" :sub="`${i.moved_from} → ${house.pathText(i.location)}`" :to="linkFor(i)" />
          </ApList>
        </ApSection>
      </div>

      <ApSection title="Rooms">
        <template #aside>
          <button
            type="button"
            class="inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-[13px] leading-[18px] font-medium text-sapphire-ink hover:underline md:text-sm"
            @click="ui.openAddRoom()"
          >
            Add a room
          </button>
        </template>
        <div v-if="!house.rooms.length" class="flex flex-col items-start gap-3 rounded-lg bg-surface-1 px-5 py-6 shadow-raised">
          <h3 class="m-0 type-title">Start with a room</h3>
          <p class="m-0 type-meta text-ink-muted">Add the rooms you store things in, then the furniture and bins inside each one.</p>
          <ApButton variant="primary" @click="ui.openAddRoom()"><template #icon><IconPlus :size="18" stroke="1.75" aria-hidden="true" /></template>Add a room</ApButton>
        </div>
        <ApTileGrid v-else>
          <ApLocationTile
            v-for="r in house.rooms"
            :key="r.id"
            :name="r.name"
            :count="house.countsFor(r.id).total"
            :meta="tileMeta(r.id).meta"
            :meta-tone="tileMeta(r.id).tone"
            :to="`/rooms/${r.id}`"
          />
        </ApTileGrid>
      </ApSection>
    </div>
  </ApContainer>
</template>
