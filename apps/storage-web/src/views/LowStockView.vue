<script setup lang="ts">
import { ApContainer, ApList, ApListRow, ApPageHead } from '@home/ui'
import { status, useHouseStore } from '@/stores/house'

const house = useHouseStore()
</script>

<template>
  <ApContainer>
    <ApPageHead title="Low stock">
      <template #meta><span class="type-meta text-ink-muted">{{ house.lowItems.length }} items under par</span></template>
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
