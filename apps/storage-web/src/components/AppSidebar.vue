<script setup>
import { useRoute } from 'vue-router'
import { IconHome, IconAlertTriangle, IconList, IconPlus, IconQrcode, IconSettings } from '@tabler/icons-vue'
import { ApBrand, ApNavGroup, ApNavItem, ApSidebar } from '@home/ui'
import { useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
const route = useRoute()
const icon = { size: 20, stroke: '1.5', 'aria-hidden': 'true' }
</script>

<template>
  <ApSidebar>
    <template #brand><ApBrand :name="house.house?.name ?? 'The House'" to="/" /></template>
    <ApNavGroup label="Catalog">
      <ApNavItem to="/" label="Browse" :active="route.name === 'home'"><template #icon><IconHome v-bind="icon" /></template></ApNavItem>
      <ApNavItem to="/lists" label="Shopping list" :count="house.shopping.length || undefined"><template #icon><IconList v-bind="icon" /></template></ApNavItem>
      <ApNavItem to="/low" label="Low stock" :count="house.lowItems.length" alert><template #icon><IconAlertTriangle v-bind="icon" /></template></ApNavItem>
      <ApNavItem to="/labels" label="Labels"><template #icon><IconQrcode v-bind="icon" /></template></ApNavItem>
    </ApNavGroup>
    <ApNavGroup label="Rooms">
      <ApNavItem
        v-for="room in house.rooms"
        :key="room.id"
        :to="`/rooms/${room.id}`"
        :label="room.name"
        :count="house.countsFor(room.id).total"
        :alert="house.countsFor(room.id).low > 0"
      />
      <li>
        <button
          type="button"
          class="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-3 text-sm leading-5 font-medium text-sapphire-ink hover:bg-surface-2"
          @click="ui.openAddRoom()"
        >
          <IconPlus v-bind="icon" />Add a room
        </button>
      </li>
    </ApNavGroup>
    <template #footer>
      <ul class="m-0 list-none p-0">
        <ApNavItem to="/settings" label="Settings"><template #icon><IconSettings v-bind="icon" /></template></ApNavItem>
      </ul>
    </template>
  </ApSidebar>
</template>
