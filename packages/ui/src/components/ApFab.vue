<script setup>
/** The round sapphire add button at the center of the tab bar. */
defineProps({ label: { type: String, required: true } })
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="inline-flex size-13 cursor-pointer items-center justify-center rounded-pill border-0 bg-sapphire sheen-strong text-on-sapphire shadow-glow transition duration-150 hover:-translate-y-px active:translate-y-px"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
