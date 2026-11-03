<script setup>
import { ref } from 'vue'
import { ApSelect } from '@home/ui'

const kept = ref('daily')
</script>

<template>
  <ApSelect v-model="kept" label="Kept as" required class="max-w-md">
    <option value="daily">Daily use</option>
    <option value="surplus">Surplus store</option>
    <option value="long_term">Long-term</option>
  </ApSelect>
</template>
