<template>
  <ApContainer>
    <ApPageHead title="Low stock">
      <template #meta>
        <span class="type-meta text-ink-muted">{{ house.lowItems.length }} items under par</span>
      </template>
    </ApPageHead>

    <ApList
      v-if="house.lowItems.length"
      class="md:max-w-3xl"
    >
      <ApListRow
        v-for="item in house.lowItems"
        :key="item.id"
        :name="item.name"
        :sub="house.pathText(item.location)"
        :status="status(item)"
        :qty="item.par !== null ? `${item.quantity} of ${item.par}` : item.quantity"
        :to="{ path: `/rooms/${house.roomOf(item.location)?.id}`, query: { in: item.location, item: item.id } }"
      />
    </ApList>

    <p
      v-else
      class="m-0 text-[15px] text-ink-muted"
    >
      Everything's at par.
    </p>
  </ApContainer>
</template>

<script setup>
  import { ApContainer, ApList, ApListRow, ApPageHead } from '@keep/ui';
  import { status, useHouseStore } from '@/stores/house';

  const house = useHouseStore();
</script>
