<script setup>
import { computed } from 'vue'
import { ApButton, ApContainer, ApList, ApListRow, ApPageHead, useToast } from '@home/ui'
import { status, useHouseStore } from '@/stores/house'

const house = useHouseStore()
const { show } = useToast()
const notListed = computed(() => house.lowItems.filter((i) => !house.onList(i.id)))
function listAll() {
  const n = notListed.value.length
  notListed.value.forEach((i) => house.toggleList(i.id))
  show(`Added ${n} to the shopping list`)
}
</script>

<template>
  <ApContainer>
    <ApPageHead title="Low stock">
      <template #meta><span class="type-meta text-ink-muted">{{ house.lowItems.length }} items under par</span></template>
      <template v-if="notListed.length" #actions>
        <ApButton variant="primary" @click="listAll">Add {{ notListed.length }} to shopping list</ApButton>
      </template>
    </ApPageHead>
    <ApList v-if="house.lowItems.length" class="md:max-w-3xl">
      <ApListRow
        v-for="i in house.lowItems"
        :key="i.id"
        :name="i.name"
        :sub="house.pathText(i.location)"
        :status="status(i)"
        :qty="i.par !== null ? `${i.quantity} of ${i.par}` : i.quantity"
        :to="{ path: `/rooms/${house.roomOf(i.location)?.id}`, query: { in: i.location, item: i.id } }"
      />
    </ApList>
    <p v-else class="m-0 text-[15px] text-ink-muted">Everything's at par.</p>
  </ApContainer>
</template>
