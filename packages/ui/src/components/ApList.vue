<template>
  <ul
    :aria-label="label"
    :class="[
      'm-0 list-none overflow-hidden p-0 [&>li+li]:border-t [&>li+li]:border-line',
      !flat && 'rounded-md bg-surface-1 sheen shadow-raised',
    ]"
  >
    <slot />
  </ul>
</template>

<script setup>
  /** Grouped list on a raised surface, or on its parent's surface when `flat`. Fill it with ApListRow. */
  defineProps({ label: String, flat: Boolean });
</script>
