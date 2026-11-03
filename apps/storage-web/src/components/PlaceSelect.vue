<script setup>
import { ApSelect } from '@home/ui'
import { useHouseStore } from '@/stores/house'

/** Location picker: every place in the house, grouped by room. */
const model = defineModel({ type: String })
defineProps({ label: { type: String, required: true }, error: String, exclude: String })
const house = useHouseStore()
</script>

<template>
  <ApSelect v-model="model" :label="label" :error="error" required>
    <option :value="null" disabled>Choose a place</option>
    <optgroup v-for="g in house.places" :key="g.room.id" :label="g.room.name">
      <option v-for="o in g.options" :key="o.id" :value="o.id" :disabled="o.id === exclude">{{ o.label }}{{ o.id === exclude ? ' (current)' : '' }}</option>
    </optgroup>
  </ApSelect>
</template>
