<template>
  <div class="flex flex-wrap gap-2">
    <ApStatusChip status="low" />
    <ApStatusChip status="surplus" />
    <ApStatusChip status="long" />
    <ApStatusChip status="ok" />
  </div>
</template>

<script setup>
  import { ApStatusChip } from '@home/ui';
</script>
