<template>
  <ApSelect
    v-model="model"
    :label="label"
    :error="error"
    required
  >
    <option
      :value="null"
      disabled
    >
      Choose a place
    </option>

    <optgroup
      v-for="group in house.places"
      :key="group.room.id"
      :label="group.room.name"
    >
      <option
        v-for="option in group.options"
        :key="option.id"
        :value="option.id"
        :disabled="option.id === exclude"
      >
        {{ option.label }}{{ option.id === exclude ? ' (current)' : '' }}
      </option>
    </optgroup>
  </ApSelect>
</template>

<script setup>
  import { ApSelect } from '@keep/ui';
  import { useHouseStore } from '@/stores/house';

  /** Location picker: every place in the house, grouped by room. */
  const model = defineModel({ type: String });
  defineProps({ label: { type: String, required: true }, error: String, exclude: String });
  const house = useHouseStore();
</script>
