<script setup lang="ts">
/**
 * List beside a detail pane at 960px and up; the pane is hidden below that.
 * On phones, show the same detail as its own screen instead (see the storage app's room view).
 */
defineProps<{ sticky?: boolean }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_var(--spacing-pane)] md:items-start lg:grid-cols-[minmax(0,1fr)_440px]">
    <div class="flex min-w-0 flex-col gap-9"><slot /></div>
    <div v-if="$slots.pane" :class="['hidden md:block', sticky !== false && 'md:sticky md:top-6']">
      <slot name="pane" />
    </div>
  </div>
</template>
