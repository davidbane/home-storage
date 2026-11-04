<template>
  <ApButton @click="open = true">
    Remove 9V batteries
  </ApButton>

  <ApDialog
    v-model:open="open"
    title="Remove 9V batteries?"
    description="It comes out of Hall closet / Drawer B and off any lists."
  >
    <template #footer>
      <ApButton
        variant="ghost"
        @click="open = false"
      >
        Keep it
      </ApButton>

      <ApButton
        variant="danger"
        @click="open = false"
      >
        Remove
      </ApButton>
    </template>
  </ApDialog>
</template>

<script setup>
  import { ref } from 'vue';
  import { ApButton, ApDialog } from '@home/ui';

  const open = ref(false);
</script>
