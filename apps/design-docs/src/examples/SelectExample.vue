<template>
  <ApSelect
    v-model="storageType"
    label="Storage type"
    required
    class="max-w-md"
  >
    <option value="drawer">
      Drawer
    </option>

    <option value="shelf">
      Shelf
    </option>

    <option value="bin">
      Bin
    </option>
  </ApSelect>
</template>

<script setup>
  import { ref } from 'vue';
  import { ApSelect } from '@keep/ui';

  const storageType = ref('drawer');
</script>
