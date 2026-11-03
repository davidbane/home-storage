<script setup>
import { IconAlertTriangle, IconHome, IconList, IconPlus, IconQrcode } from '@tabler/icons-vue'
import { ApFab, ApTab, ApTabBar } from '@home/ui'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const icon = { size: 22, stroke: '1.5', 'aria-hidden': 'true' }
</script>

<template>
  <ApTabBar>
    <ApTab to="/" label="Browse"><template #icon><IconHome v-bind="icon" /></template></ApTab>
    <ApTab to="/lists" label="Lists"><template #icon><IconList v-bind="icon" /></template></ApTab>
    <ApFab label="Add item" @click="ui.openAdd()"><IconPlus :size="22" stroke="1.75" aria-hidden="true" /></ApFab>
    <ApTab to="/low" label="Low"><template #icon><IconAlertTriangle v-bind="icon" /></template></ApTab>
    <ApTab to="/labels" label="Labels"><template #icon><IconQrcode v-bind="icon" /></template></ApTab>
  </ApTabBar>
</template>
