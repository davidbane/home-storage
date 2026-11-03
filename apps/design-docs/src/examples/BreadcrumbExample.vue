<script setup>
import { ApBreadcrumb } from '@home/ui'

const path = [
  { label: 'The House', to: '/' },
  { label: 'Hall closet', to: '/' },
  { label: 'Drawer chest', to: '/' },
  { label: 'Drawer B' },
]
</script>

<template>
  <ApBreadcrumb :items="path" current />
</template>
