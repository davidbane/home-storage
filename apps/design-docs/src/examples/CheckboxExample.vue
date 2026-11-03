<script setup>
import { ref } from 'vue'
import { ApCheckbox } from '@home/ui'

const a = ref(true)
const b = ref(false)
</script>

<template>
  <div class="flex flex-col">
    <ApCheckbox v-model="a" label="Drawer chest / Drawer A" />
    <ApCheckbox v-model="b" label="Drawer chest / Drawer B" />
  </div>
</template>
