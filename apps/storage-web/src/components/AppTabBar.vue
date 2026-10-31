<script setup lang="ts">
import { IconAlertTriangle, IconHome, IconList, IconPlus, IconQrcode } from '@tabler/icons-vue'
import { ApFab, ApTab, ApTabBar } from '@home/ui'

const icon = { size: 22, stroke: 1.5, 'aria-hidden': 'true' } as const
</script>

<template>
  <ApTabBar>
    <ApTab to="/" label="Browse"><template #icon><IconHome v-bind="icon" /></template></ApTab>
    <ApTab to="/lists" label="Lists" :active="false"><template #icon><IconList v-bind="icon" /></template></ApTab>
    <ApFab label="Add item"><IconPlus :size="22" :stroke="1.75" aria-hidden="true" /></ApFab>
    <ApTab to="/low" label="Low"><template #icon><IconAlertTriangle v-bind="icon" /></template></ApTab>
    <ApTab to="/labels" label="Labels" :active="false"><template #icon><IconQrcode v-bind="icon" /></template></ApTab>
  </ApTabBar>
</template>
