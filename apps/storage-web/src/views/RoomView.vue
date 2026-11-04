<template>
  <ApContainer v-if="room">
    <!-- Phone item screen: the same item, as its own page. -->
    <template v-if="showItemScreen && openItem">
      <ApPageHead :title="openItem.name">
        <template #back>
          <div class="flex items-center gap-2">
            <ApIconButton
              label="Back"
              :to="withQuery({ item: undefined })"
            >
              <IconArrowLeft
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>

            <span class="flex-1" />

            <ApIconButton
              label="Edit item"
              @click="ui.openEdit(openItem.id)"
            >
              <IconPencil
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>

            <ApIconButton
              label="Remove item"
              class="text-oxblood-ink!"
              @click="ui.openRemove(openItem.id)"
            >
              <IconTrash
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>
          </div>
        </template>

        <template #eyebrow>
          <ApBreadcrumb :items="house.crumbs(openItem.location)" />
        </template>

        <template #meta>
          <div class="flex flex-wrap items-center gap-2">
            <ApStatusChip :status="status(openItem)" />

            <ApBinTag
              v-if="house.location(openItem.location)?.code"
              :code="house.location(openItem.location).code"
              :label="house.location(openItem.location).name"
            />
          </div>
        </template>
      </ApPageHead>

      <ItemDetail
        :item-id="openItem.id"
        variant="body"
      />

      <ApDock>
        <ApButton
          class="flex-1"
          @click="ui.openMove(openItem.id)"
        >
          Move
        </ApButton>

        <ApButton
          :variant="house.onList(openItem.id) ? 'tonal' : 'primary'"
          class="flex-2"
          :aria-pressed="house.onList(openItem.id)"
          @click="house.toggleList(openItem.id)"
        >
          <template
            v-if="house.onList(openItem.id)"
            #icon
          >
            <IconCheck
              :size="18"
              stroke="1.75"
              aria-hidden="true"
            />
          </template>
          {{ house.onList(openItem.id) ? 'On shopping list' : 'Add to shopping list' }}
        </ApButton>
      </ApDock>
    </template>

    <template v-else>
      <ApPageHead :title="room.name">
        <template #back>
          <div class="flex items-center gap-2">
            <ApIconButton
              label="Back"
              to="/"
            >
              <IconArrowLeft
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>

            <span class="flex-1" />

            <ApIconButton
              label="Edit room"
              @click="ui.openEditRoom(room.id)"
            >
              <IconPencil
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>

            <ApIconButton
              label="Add storage to this room"
              @click="ui.openAddSpot(room.id)"
            >
              <IconBoxMultiple
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>
          </div>
        </template>

        <template #eyebrow>
          <ApBreadcrumb
            :items="house.crumbs(room.id)"
            current
          />
        </template>

        <template #meta>
          <div class="flex flex-wrap items-center gap-2.5">
            <ApBinTag
              v-for="piece in furniture.filter((candidate) => candidate.code)"
              :key="piece.id"
              :code="piece.code"
              :label="piece.note || piece.name"
            />

            <span class="type-meta text-ink-muted">{{ summary }}</span>
          </div>
        </template>

        <template #actions>
          <div class="hidden gap-3 md:flex">
            <ApIconButton
              label="Edit room"
              size="lg"
              @click="ui.openEditRoom(room.id)"
            >
              <IconPencil
                :size="20"
                stroke="1.5"
                aria-hidden="true"
              />
            </ApIconButton>

            <ApButton @click="ui.openAddSpot(room.id)">
              <template #icon>
                <IconBoxMultiple
                  :size="18"
                  stroke="1.5"
                  aria-hidden="true"
                />
              </template>Add storage
            </ApButton>

            <ApButton :to="{ name: 'labels', query: { room: room.id } }">
              <template #icon>
                <IconPrinter
                  :size="18"
                  stroke="1.5"
                  aria-hidden="true"
                />
              </template>Print labels
            </ApButton>

            <ApButton
              v-if="selected"
              @click="ui.openAdd(selected.id)"
            >
              <template #icon>
                <IconPlus
                  :size="18"
                  stroke="1.75"
                  aria-hidden="true"
                />
              </template>Add to {{ selected.name }}
            </ApButton>
          </div>
        </template>
      </ApPageHead>

      <ApSplit>
        <div
          v-if="!furniture.length"
          class="flex flex-col items-start gap-3 rounded-lg bg-surface-1 px-5 py-6 shadow-raised"
        >
          <h2 class="m-0 type-title">
            No storage here yet
          </h2>

          <p class="m-0 type-meta text-ink-muted">
            Add the furniture, shelves or bins in {{ room.name }}, then the drawers or slots inside them.
          </p>

          <ApButton
            variant="primary"
            @click="ui.openAddSpot(room.id)"
          >
            <template #icon>
              <IconPlus
                :size="18"
                stroke="1.75"
                aria-hidden="true"
              />
            </template>Add storage
          </ApButton>
        </div>

        <ApSection
          v-for="piece in furniture"
          :key="piece.id"
          :title="piece.name"
        >
          <template #aside>
            <div class="flex items-center gap-4">
              <span
                v-if="house.typeName(piece.type)"
                class="hidden type-meta text-ink-muted sm:inline"
              >{{ house.typeName(piece.type) }}</span>

              <button
                type="button"
                :class="textBtn"
                @click="ui.openAddSpot(piece.id)"
              >
                Add inside
              </button>

              <button
                type="button"
                :class="textBtn"
                :aria-label="`Edit ${piece.name}`"
                @click="ui.openEditSpot(piece.id)"
              >
                Edit
              </button>
            </div>
          </template>

          <ApTileGrid :columns="house.children(piece.id).length === 6 || house.children(piece.id).length === 3 ? 3 : undefined">
            <ApLocationTile
              v-for="container in house.children(piece.id).length ? house.children(piece.id) : [piece]"
              :key="container.id"
              :name="container.name"
              :count="house.countsFor(container.id).total"
              :meta="tileMeta(container.id, container.note).meta"
              :meta-tone="tileMeta(container.id, container.note).tone"
              :selected="container.id === selectedId"
              :to="withQuery({ in: container.id, item: undefined })"
              replace
            />
          </ApTileGrid>
        </ApSection>

        <ApSection
          v-if="selected"
          :title="`In ${selected.name}`"
        >
          <template #aside>
            <div class="flex items-center gap-4">
              <span
                v-if="selected.code"
                class="type-code text-ink-muted"
              >{{ selected.code }}</span>

              <button
                v-if="selected.kind !== 'furniture' && !furniture.some((piece) => piece.id === selected.id)"
                type="button"
                :class="textBtn"
                :aria-label="`Edit ${selected.name}`"
                @click="ui.openEditSpot(selected.id)"
              >
                Edit
              </button>
            </div>
          </template>

          <ApList v-if="contents.length">
            <ApListRow
              v-for="item in contents"
              :key="item.id"
              :name="item.name"
              :sub="rowSub(item)"
              :status="status(item)"
              :qty="item.quantity"
              :selected="isDesktop && item.id === itemId"
              :to="withQuery({ item: item.id })"
            />
          </ApList>

          <div
            v-else
            class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-1 px-4 py-4 shadow-raised"
          >
            <span class="text-[15px] text-ink-muted">Nothing here yet.</span>

            <ApButton @click="ui.openAdd(selected.id)">
              <template #icon>
                <IconPlus
                  :size="18"
                  stroke="1.75"
                  aria-hidden="true"
                />
              </template>Add item
            </ApButton>
          </div>
        </ApSection>

        <template
          v-if="openItem"
          #pane
        >
          <ItemDetail
            :item-id="openItem.id"
            variant="pane"
            @close="closeItem"
          />
        </template>
      </ApSplit>

      <ApDock>
        <ApButton
          class="flex-1"
          :to="{ name: 'labels', query: selected ? { ids: selected.id } : { room: room.id } }"
        >
          <template #icon>
            <IconPrinter
              :size="18"
              stroke="1.5"
              aria-hidden="true"
            />
          </template>Print label
        </ApButton>

        <ApButton
          v-if="selected"
          variant="primary"
          class="flex-[1.4]"
          @click="ui.openAdd(selected.id)"
        >
          <template #icon>
            <IconPlus
              :size="18"
              stroke="1.75"
              aria-hidden="true"
            />
          </template>Add to {{ selected.name }}
        </ApButton>
      </ApDock>
    </template>
  </ApContainer>

  <ApContainer v-else>
    <ApPageHead title="Room not found" />

    <ApButton to="/">
      Back to the house
    </ApButton>
  </ApContainer>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { IconArrowLeft, IconBoxMultiple, IconCheck, IconPencil, IconPlus, IconPrinter, IconTrash } from '@tabler/icons-vue';
  import {
    ApBinTag, ApBreadcrumb, ApButton, ApContainer, ApDock, ApIconButton, ApList, ApListRow,
    ApLocationTile, ApPageHead, ApSection, ApSplit, ApStatusChip, ApTileGrid, useIsDesktop,
  } from '@home/ui';
  import ItemDetail from '@/components/ItemDetail.vue';
  import { status, useHouseStore } from '@/stores/house';
  import { useUiStore } from '@/stores/ui';

  const house = useHouseStore();
  const ui = useUiStore();
  const route = useRoute();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const room = computed(() => house.location(String(route.params.roomId)));
  const furniture = computed(() => (room.value ? house.children(room.value.id) : []));
  const containers = computed(() => furniture.value.flatMap((piece) => (house.children(piece.id).length ? house.children(piece.id) : [piece])));

  // ?in= selects a container (default: the first with something low, else the first).
  const selectedId = computed(() => {
    const requested = route.query.in;
    if (typeof requested === 'string' && containers.value.some((container) => container.id === requested)) {
      return requested;
    }
    return (containers.value.find((container) => house.countsFor(container.id).low) ?? containers.value[0])?.id;
  });
  const selected = computed(() => (selectedId.value ? house.location(selectedId.value) : undefined));
  // Deep, so items in slots inside the selected container show too.
  const contents = computed(() => (selectedId.value ? house.itemsIn(selectedId.value) : []));
  /** Detail line for a row: the slot it's in when deeper than the selected container, else par or note. */
  const rowSub = (item) => {
    if (item.location !== selectedId.value) {
      const path = house.ancestry(item.location);
      const from = path.findIndex((place) => place.id === selectedId.value);
      return path.slice(from + 1).map((place) => place.name).join(' / ');
    }
    return item.par !== null ? `Par ${item.par}` : item.used_for;
  };
  const textBtn = 'inline-flex min-h-11 items-center cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-[18px] font-medium text-sapphire-ink hover:underline md:text-sm';

  // ?item= opens an item: a pane on desktop, its own screen on phones. Same URL either way.
  const itemId = computed(() => (typeof route.query.item === 'string' && house.item(route.query.item) ? route.query.item : undefined));
  const openItem = computed(() => (itemId.value ? house.item(itemId.value) : undefined));
  const showItemScreen = computed(() => Boolean(openItem.value) && !isDesktop.value);

  const roomCounts = computed(() => (room.value ? house.countsFor(room.value.id) : { total: 0, low: 0, surplus: 0 }));
  const summary = computed(() => {
    const counts = roomCounts.value;
    return [`${counts.total} items`, counts.low && `${counts.low} low`, counts.surplus && `${counts.surplus} surplus`].filter(Boolean).join(' · ');
  });
  const withQuery = (changes) => ({ query: { ...route.query, ...changes } });
  const closeItem = () => router.replace(withQuery({ item: undefined }));
  const tileMeta = (id, note) => {
    const counts = house.countsFor(id);
    if (counts.low) {
      return { meta: `${counts.low} low`, tone: 'alert' };
    }
    if (counts.total === 0) {
      return { meta: 'empty', tone: 'muted' };
    }
    return { meta: note, tone: 'muted' };
  };
</script>
