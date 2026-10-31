<script setup lang="ts">
import { IconAlertTriangle, IconHome } from '@tabler/icons-vue'
import { ApBrand, ApNavGroup, ApNavItem, ApSidebar } from '@home/ui'
</script>

<!-- In an app, ApShell shows the sidebar only at 960px and up, full height and sticky.
     The wrapper here just lets it sit in the page. -->
<template>
  <div class="h-96 overflow-hidden rounded-lg [&>nav]:h-full!">
    <ApSidebar>
      <template #brand><ApBrand name="The House" to="/" /></template>
      <ApNavGroup label="Catalog">
        <ApNavItem to="/" label="Browse" active><template #icon><IconHome :size="20" stroke="1.5" /></template></ApNavItem>
        <ApNavItem to="/" label="Low stock" :count="4" alert :active="false"><template #icon><IconAlertTriangle :size="20" stroke="1.5" /></template></ApNavItem>
      </ApNavGroup>
      <ApNavGroup label="Rooms">
        <ApNavItem to="/" label="Kitchen" :count="64" :active="false" />
        <ApNavItem to="/" label="Hall closet" :count="41" alert :active="false" />
      </ApNavGroup>
    </ApSidebar>
  </div>
</template>
