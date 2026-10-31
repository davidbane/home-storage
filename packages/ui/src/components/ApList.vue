<script setup lang="ts">
/** Grouped list on a raised surface. Fill it with ApListRow. */
defineProps<{ label?: string }>()
</script>

<template>
  <ul
    :aria-label="label"
    class="m-0 list-none overflow-hidden rounded-md bg-surface-1 sheen p-0 shadow-raised [&>li+li]:border-t [&>li+li]:border-line"
  >
    <slot />
  </ul>
</template>
