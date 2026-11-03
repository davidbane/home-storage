<script setup>
/** A labelled group of ApNavItem in the sidebar. */
defineProps({ label: String })
</script>

<template>
  <div>
    <div v-if="label" class="px-3 pt-4 pb-1.5 type-caption text-ink-muted">{{ label }}</div>
    <ul class="m-0 flex list-none flex-col gap-0.5 p-0"><slot /></ul>
  </div>
</template>
