<template>
  <ApBreadcrumb
    :items="path"
    current
  />
</template>

<script setup>
  import { ApBreadcrumb } from '@keep/ui';

  const path = [
    { label: 'The House', to: '/' },
    { label: 'Hall closet', to: '/' },
    { label: 'Drawer chest', to: '/' },
    { label: 'Drawer B' },
  ];
</script>
