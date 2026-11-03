<script setup>
import { ApLocationTile, ApTileGrid } from '@home/ui'
</script>

<template>
  <ApTileGrid :columns="3" class="max-w-md">
    <ApLocationTile name="Drawer A" :count="18" meta="tools, tape" to="/" />
    <ApLocationTile name="Drawer B" :count="9" meta="1 low" meta-tone="alert" to="/" selected />
    <ApLocationTile name="Drawer E" :count="0" meta="empty" to="/" />
  </ApTileGrid>
</template>
