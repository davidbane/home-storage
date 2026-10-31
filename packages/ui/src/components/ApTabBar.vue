<script setup lang="ts">
/** Floating phone navigation: four ApTab around an ApFab. Hidden at 960px and up. */
defineProps<{ label?: string }>()
</script>

<template>
  <nav
    :aria-label="label ?? 'Main'"
    class="fixed right-5 bottom-6 left-5 z-10 flex items-center justify-between gap-1 rounded-pill bg-surface-2 p-1.5 shadow-float [background-image:linear-gradient(180deg,#ffffff0a,#ffffff00)] sm:right-auto sm:left-1/2 sm:w-110 sm:-translate-x-1/2 md:hidden"
  >
    <slot />
  </nav>
</template>
