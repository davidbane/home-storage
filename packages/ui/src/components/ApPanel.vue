<script setup lang="ts">
/** A raised surface for grouped controls and detail panes. */
withDefaults(defineProps<{ as?: string; padded?: boolean }>(), { as: 'section', padded: true })
</script>

<template>
  <component :is="as" :class="['rounded-lg bg-surface-1 sheen shadow-raised', padded && 'p-4 md:p-6']">
    <slot />
  </component>
</template>
