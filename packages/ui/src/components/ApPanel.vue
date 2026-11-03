<template>
  <component
    :is="as"
    :class="['rounded-lg bg-surface-1 sheen shadow-raised', padded && 'p-4 md:p-6']"
  >
    <slot />
  </component>
</template>

<script setup>
  /** A raised surface for grouped controls and detail panes. */
  defineProps({ as: { type: String, default: 'section' }, padded: { type: Boolean, default: true } });
</script>
