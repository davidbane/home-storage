<template>
  <div class="flex flex-col">
    <ApCheckbox
      v-model="drawerA"
      label="Drawer chest / Drawer A"
    />

    <ApCheckbox
      v-model="drawerB"
      label="Drawer chest / Drawer B"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { ApCheckbox } from '@keep/ui';

  const drawerA = ref(true);
  const drawerB = ref(false);
</script>
