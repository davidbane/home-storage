<template>
  <ApFeature class="grid max-w-xl grid-cols-3 gap-6">
    <ApStat
      :value="312"
      label="items filed"
    />

    <ApStat
      :value="4"
      label="running low"
    />

    <ApStat
      :value="6"
      label="rooms"
    />
  </ApFeature>
</template>

<script setup>
  import { ApFeature, ApStat } from '@keep/ui';
</script>
