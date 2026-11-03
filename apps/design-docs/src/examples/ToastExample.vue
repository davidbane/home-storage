<script setup>
import { ApButton, useToast } from '@home/ui'

const { show } = useToast()
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <ApButton @click="show('Saved 9V batteries')">Show a toast</ApButton>
    <ApButton @click="show('Removed 9V batteries from Drawer B', { action: { label: 'Undo', run: () => show('Put it back') } })">With Undo</ApButton>
  </div>
</template>
