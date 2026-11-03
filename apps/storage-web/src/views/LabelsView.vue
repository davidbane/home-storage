<template>
  <ApContainer>
    <div class="print:hidden">
      <ApPageHead title="Labels">
        <template #meta>
          <span class="type-meta text-ink-muted">Pick bins, then print on 2⅝ × 1 in address labels.</span>
        </template>
        <template #actions>
          <ApButton
            variant="primary"
            @click="print"
          >
            <template #icon>
              <IconPrinter
                :size="18"
                stroke="1.5"
                aria-hidden="true"
              />
            </template>
            Print {{ sheet.length || '' }} {{ sheet.length === 1 ? 'label' : 'labels' }}
          </ApButton>
        </template>
      </ApPageHead>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] print:block">
      <div class="flex flex-col gap-6 print:hidden">
        <ApSection
          v-for="group in groups"
          :key="group.room.id"
          :title="group.room.name"
          as="h3"
        >
          <template #aside>
            <button
              type="button"
              class="cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-[18px] font-medium text-sapphire-ink hover:underline md:text-sm"
              @click="setRoom(group.places.map((place) => place.id), !group.places.every((place) => isOn(place.id)))"
            >
              {{ group.places.every((place) => isOn(place.id)) ? 'Select none' : 'Select all' }}
            </button>
          </template>
          <ul class="m-0 list-none rounded-md bg-surface-1 px-4 py-1 shadow-raised">
            <li
              v-for="place in group.places"
              :key="place.id"
              class="flex items-center justify-between gap-3 [&+&]:border-t [&+&]:border-line"
            >
              <ApCheckbox
                :model-value="isOn(place.id)"
                @update:model-value="(checked) => set(place.id, checked)"
              >
                {{ house.ancestry(place.id).slice(1).map((ancestor) => ancestor.name).join(' / ') }}
              </ApCheckbox>
              <span
                v-if="place.code"
                class="type-code text-ink-muted"
              >{{ place.code }}</span>
            </li>
          </ul>
        </ApSection>
      </div>

      <section
        aria-label="Label sheet preview"
        class="flex flex-col gap-3"
      >
        <h2 class="m-0 type-title print:hidden">
          Preview
        </h2>
        <p
          v-if="!sheet.length"
          class="m-0 type-meta text-ink-muted print:hidden"
        >
          Nothing selected yet.
        </p>
        <!-- Light theme on screen and paper: labels are printed matter. -->
        <div
          v-else
          data-theme="parchment"
          class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-2 rounded-md bg-surface-0 p-3 print:grid-cols-[repeat(3,2.625in)] print:gap-x-[0.125in] print:gap-y-0 print:bg-transparent print:p-0"
        >
          <div
            v-for="label in sheet"
            :key="label.id"
            class="box-border flex h-[1in] flex-col justify-center gap-0.5 overflow-hidden rounded-sm border border-brass bg-surface-1 px-3 text-ink print:break-inside-avoid print:rounded-none print:border-0 print:bg-transparent"
          >
            <span
              v-if="label.code"
              class="font-mono text-[11pt] leading-tight font-semibold tracking-wide text-brass"
            >{{ label.code }}</span>
            <span class="truncate font-display text-[14pt] leading-tight font-semibold">{{ label.name }}</span>
            <span class="truncate text-[8pt] leading-tight text-ink-muted">{{ house.pathText(label.id) }}</span>
          </div>
        </div>
      </section>
    </div>
  </ApContainer>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { IconPrinter } from '@tabler/icons-vue';
  import { ApButton, ApCheckbox, ApContainer, ApPageHead, ApSection, useToast } from '@home/ui';
  import { useHouseStore } from '@/stores/house';

  /**
   * Pick bins and print their labels. The sheet is laid out for 2⅝ × 1 in address
   * labels (30 to a US Letter page, e.g. Avery 5160) and prints in the light theme.
   */
  const house = useHouseStore();
  const route = useRoute();
  const { show } = useToast();

  const groups = computed(() =>
    house.rooms
      .map((room) => ({ room, places: house.labelled.filter((place) => house.roomOf(place.id)?.id === room.id) }))
      .filter((group) => group.places.length),
  );
  const selected = ref(new Set());

  // Preselect from ?room= or ?ids= whenever the query or data changes.
  watch(
    () => [route.query.room, route.query.ids, house.locations.length],
    () => {
      const ids = typeof route.query.ids === 'string' ? route.query.ids.split(',') : [];
      const room = typeof route.query.room === 'string' ? route.query.room : undefined;
      const next = new Set(ids);
      if (room) {
        groups.value.find((group) => group.room.id === room)?.places.forEach((place) => next.add(place.id));
      }
      selected.value = next;
    },
    { immediate: true },
  );

  const isOn = (id) => selected.value.has(id);
  function set(id, isSelected) {
    const next = new Set(selected.value);
    isSelected ? next.add(id) : next.delete(id);
    selected.value = next;
  }
  function setRoom(ids, isSelected) {
    const next = new Set(selected.value);
    ids.forEach((id) => (isSelected ? next.add(id) : next.delete(id)));
    selected.value = next;
  }
  const sheet = computed(() => house.labelled.filter((place) => selected.value.has(place.id)));

  function print() {
    if (!sheet.value.length) {
      return void show('Pick at least one bin to print.', { tone: 'danger' });
    }
    window.print();
  }
</script>
