<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ApShell } from '@home/ui'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTabBar from '@/components/AppTabBar.vue'

const route = useRoute()
</script>

<template>
  <ApShell>
    <template #sidebar><AppSidebar /></template>
    <RouterView />
    <template #bottom><AppTabBar v-if="!route.meta.dock" /></template>
  </ApShell>
</template>
