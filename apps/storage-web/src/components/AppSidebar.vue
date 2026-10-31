<script setup lang="ts">
import { useRoute } from 'vue-router'
import { IconHome, IconAlertTriangle, IconList, IconQrcode, IconMoon, IconSun } from '@tabler/icons-vue'
import { ApBrand, ApButton, ApNavGroup, ApNavItem, ApSidebar, useTheme } from '@home/ui'
import { useHouseStore } from '@/stores/house'

const house = useHouseStore()
const route = useRoute()
const { theme, toggle } = useTheme()
const icon = { size: 20, stroke: 1.5, 'aria-hidden': 'true' } as const
</script>

<template>
  <ApSidebar>
    <template #brand><ApBrand :name="house.house?.name ?? 'The House'" to="/" /></template>
    <ApNavGroup label="Catalog">
      <ApNavItem to="/" label="Browse" :active="route.name === 'home'"><template #icon><IconHome v-bind="icon" /></template></ApNavItem>
      <ApNavItem to="/lists" label="Lists" :active="false"><template #icon><IconList v-bind="icon" /></template></ApNavItem>
      <ApNavItem to="/low" label="Low stock" :count="house.lowItems.length" alert><template #icon><IconAlertTriangle v-bind="icon" /></template></ApNavItem>
      <ApNavItem to="/labels" label="Labels" :active="false"><template #icon><IconQrcode v-bind="icon" /></template></ApNavItem>
    </ApNavGroup>
    <ApNavGroup label="Rooms">
      <ApNavItem
        v-for="r in house.rooms"
        :key="r.id"
        :to="`/rooms/${r.id}`"
        :label="r.name"
        :count="house.countsFor(r.id).total"
        :alert="house.countsFor(r.id).low > 0"
      />
    </ApNavGroup>
    <template #footer>
      <ApButton variant="ghost" block class="justify-start! px-3!" @click="toggle">
        <template #icon><IconSun v-if="theme === 'night'" v-bind="icon" /><IconMoon v-else v-bind="icon" /></template>
        {{ theme === 'night' ? 'Parchment theme' : 'Night theme' }}
      </ApButton>
    </template>
  </ApSidebar>
</template>
