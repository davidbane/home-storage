<template>
  <ApShell>
    <template #sidebar>
      <AppSidebar />
    </template>

    <ApContainer
      v-if="house.error"
      class="pt-8"
    >
      <ApPanel
        role="alert"
        class="flex flex-col items-start gap-3"
      >
        <h1 class="m-0 type-title">
          Couldn't load the house
        </h1>

        <p class="m-0 type-meta text-ink-muted">
          {{ house.error }}
        </p>

        <ApButton @click="house.load()">
          Try again
        </ApButton>
      </ApPanel>
    </ApContainer>

    <ApContainer
      v-else-if="house.loading && !house.locations.length"
      class="pt-8"
    >
      <p
        class="m-0 type-meta text-ink-muted"
        aria-live="polite"
      >
        Opening the cabinet…
      </p>
    </ApContainer>

    <RouterView v-else />

    <template #bottom>
      <AppTabBar v-if="!route.meta.dock" />
    </template>
  </ApShell>

  <ItemFormDialog />

  <MoveDialog />

  <RemoveDialog />

  <FindDialog />

  <RoomFormDialog />

  <SpotFormDialog />

  <PlaceRemoveDialog />

  <ApToaster />
</template>

<script setup>
  import { RouterView, useRoute } from 'vue-router';
  import { ApButton, ApContainer, ApPanel, ApShell, ApToaster } from '@home/ui';
  import AppSidebar from '@/components/AppSidebar.vue';
  import AppTabBar from '@/components/AppTabBar.vue';
  import FindDialog from '@/components/dialogs/FindDialog.vue';
  import ItemFormDialog from '@/components/dialogs/ItemFormDialog.vue';
  import MoveDialog from '@/components/dialogs/MoveDialog.vue';
  import PlaceRemoveDialog from '@/components/dialogs/PlaceRemoveDialog.vue';
  import RemoveDialog from '@/components/dialogs/RemoveDialog.vue';
  import RoomFormDialog from '@/components/dialogs/RoomFormDialog.vue';
  import SpotFormDialog from '@/components/dialogs/SpotFormDialog.vue';
  import { useHouseStore } from '@/stores/house';

  const route = useRoute();
  const house = useHouseStore();
</script>
