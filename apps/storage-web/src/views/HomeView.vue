<template>
  <ApContainer>
    <ApPageHead :title="house.house?.name ?? 'The House'">
      <template #eyebrow>
        <div class="flex items-center gap-2">
          <span class="flex-1 text-[13px] leading-[18px] font-medium text-ink-muted">{{ greeting }}</span>
          <div class="flex gap-2 md:hidden">
            <ApIconButton
              label="Settings"
              to="/settings"
            >
              <IconSettings
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>
            <ApIconButton
              label="Find a bin by its label code"
              @click="ui.openFind()"
            >
              <IconScan
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>
          </div>
        </div>
      </template>
      <template #actions>
        <ApSearchField
          v-model="query"
          shortcut
          class="max-w-105 flex-1"
        />
        <ApIconButton
          label="Find a bin by its label code"
          size="lg"
          class="hidden! md:inline-flex!"
          @click="ui.openFind()"
        >
          <IconScan
            :size="20"
            stroke="1.5"
            aria-hidden="true"
          />
        </ApIconButton>
        <ApButton
          variant="primary"
          class="hidden! md:inline-flex!"
          @click="ui.openAdd()"
        >
          <template #icon>
            <IconPlus
              :size="18"
              stroke="1.75"
              aria-hidden="true"
            />
          </template>Add item
        </ApButton>
      </template>
    </ApPageHead>

    <div
      v-if="query.trim()"
      class="flex flex-col gap-3"
    >
      <p class="m-0 type-meta text-ink-muted">
        {{ results.length }} {{ results.length === 1 ? 'match' : 'matches' }} for “{{ query.trim() }}”
      </p>
      <ApList
        v-if="results.length"
        label="Search results"
      >
        <ApListRow
          v-for="item in results"
          :key="item.id"
          :name="item.name"
          :sub="house.pathText(item.location)"
          :status="status(item)"
          :qty="item.quantity"
          :to="linkFor(item)"
        />
      </ApList>
      <p
        v-else
        class="m-0 text-[15px] text-ink-muted"
      >
        No match. Try a room name, or browse below.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col gap-6 md:gap-10"
    >
      <ApFeature
        aria-label="Summary"
        class="grid grid-cols-3 gap-x-6 gap-y-4 md:grid-cols-4"
      >
        <ApStat
          :value="house.items.length"
          label="items filed"
        />
        <ApStat
          :value="house.lowItems.length"
          label="running low"
        />
        <ApStat
          :value="house.surplusItems.length"
          label="in surplus"
          class="hidden md:flex"
        />
        <ApStat
          :value="house.rooms.length"
          label="rooms"
          class="md:hidden"
        />
        <ApStat
          :value="house.longTermItems.length"
          label="long-term"
          class="hidden md:flex"
        />
      </ApFeature>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <ApSection
          title="Needs attention"
          link-label="See all"
          link-to="/low"
        >
          <ApList>
            <ApListRow
              v-for="item in attention"
              :key="item.id"
              :name="item.name"
              :sub="house.pathText(item.location)"
              :status="status(item)"
              :qty="item.quantity"
              :to="linkFor(item)"
            />
          </ApList>
        </ApSection>
        <ApSection
          title="Recently moved"
          class="hidden md:flex"
        >
          <ApList>
            <ApListRow
              v-for="item in house.items.filter((candidate) => candidate.moved_from)"
              :key="item.id"
              :name="item.name"
              :sub="`${item.moved_from} → ${house.pathText(item.location)}`"
              :to="linkFor(item)"
            />
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
        <div
          v-if="!house.rooms.length"
          class="flex flex-col items-start gap-3 rounded-lg bg-surface-1 px-5 py-6 shadow-raised"
        >
          <h3 class="m-0 type-title">
            Start with a room
          </h3>
          <p class="m-0 type-meta text-ink-muted">
            Add the rooms you store things in, then the furniture and bins inside each one.
          </p>
          <ApButton
            variant="primary"
            @click="ui.openAddRoom()"
          >
            <template #icon>
              <IconPlus
                :size="18"
                stroke="1.75"
                aria-hidden="true"
              />
            </template>Add a room
          </ApButton>
        </div>
        <ApTileGrid v-else>
          <ApLocationTile
            v-for="room in house.rooms"
            :key="room.id"
            :name="room.name"
            :count="house.countsFor(room.id).total"
            :meta="tileMeta(room.id).meta"
            :meta-tone="tileMeta(room.id).tone"
            :to="`/rooms/${room.id}`"
          />
        </ApTileGrid>
      </ApSection>
    </div>
  </ApContainer>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { IconPlus, IconScan, IconSettings } from '@tabler/icons-vue';
  import {
    ApButton, ApContainer, ApFeature, ApIconButton, ApList, ApListRow, ApLocationTile,
    ApPageHead, ApSearchField, ApSection, ApStat, ApTileGrid,
  } from '@home/ui';
  import { status, useHouseStore } from '@/stores/house';
  import { useUiStore } from '@/stores/ui';

  const house = useHouseStore();
  const ui = useUiStore();
  const query = ref('');
  const results = computed(() => house.search(query.value));
  const attention = computed(() => [...house.lowItems, ...house.surplusItems].slice(0, 4));

  const greeting = computed(() => {
    const hour = new Date().getHours();
    const day = new Date().toLocaleDateString(undefined, { weekday: 'long' });
    return `${day} ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}`;
  });
  const linkFor = (item) => ({ path: `/rooms/${house.roomOf(item.location)?.id}`, query: { in: item.location, item: item.id } });
  const tileMeta = (id) => {
    const counts = house.countsFor(id);
    return counts.low ? { meta: `${counts.low} low`, tone: 'alert' } : counts.surplus ? { meta: `${counts.surplus} surplus`, tone: 'muted' } : { meta: 'all stocked', tone: 'muted' };
  };
</script>
