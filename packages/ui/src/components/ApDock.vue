<script setup>
/** Bottom action dock on phones, casting a shadow up over the content. Desktop puts these actions in the page head. */
defineProps({ mobileOnly: { type: Boolean, default: true } })
</script>

<template>
  <div :class="['fixed inset-x-0 bottom-0 z-10 bg-surface-0 px-5 pt-4 pb-7 shadow-dock print:hidden', mobileOnly && 'md:hidden']">
    <div class="mx-auto flex max-w-110 gap-2.5"><slot /></div>
  </div>
</template>
