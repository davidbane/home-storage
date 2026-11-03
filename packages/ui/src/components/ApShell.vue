<template>
  <div class="flex min-h-dvh bg-surface-0 text-ink">
    <div
      v-if="$slots.sidebar"
      class="hidden md:block print:hidden"
    >
      <slot name="sidebar" />
    </div>
    <main class="min-w-0 flex-1 pb-32 md:pb-12">
      <slot />
    </main>
    <slot name="bottom" />
  </div>
</template>

<script setup>
/**
 * App frame. Desktop (≥960px): sticky sidebar + main. Phone and tablet: main only,
 * with the tab bar or an action dock floating over the bottom.
 * Slots: sidebar, default, bottom (ApTabBar or ApDock).
 */
</script>
