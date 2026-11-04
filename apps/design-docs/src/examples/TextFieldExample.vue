<template>
  <div class="grid max-w-md gap-4">
    <ApTextField
      v-model="name"
      label="Name"
      required
      :maxlength="30"
    />

    <ApTextField
      v-model="par"
      label="Par"
      inputmode="numeric"
      error="Enter a whole number, or leave it empty."
    />

    <ApTextField
      v-model="brand"
      label="Brand"
      placeholder="Energizer"
      hint="Shown on the item page"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { ApTextField } from '@home/ui';

  const name = ref('AA batteries');
  const par = ref('four');
  const brand = ref('');
</script>
