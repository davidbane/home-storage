<template>
  <ApStepper
    v-model="count"
    :max="99"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { ApStepper } from '@keep/ui';

  const count = ref(3);
</script>
