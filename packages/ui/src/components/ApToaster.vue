<script setup lang="ts">
import { useToast } from '../composables/useToast'

/** Renders toasts from useToast(). Sits above the tab bar on phones, bottom-right on desktop. */
const { toasts, dismiss } = useToast()
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="pointer-events-none fixed inset-x-5 bottom-28 z-40 flex flex-col items-center gap-2 md:inset-x-auto md:right-8 md:bottom-8 md:items-end print:hidden"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      class="pointer-events-auto flex max-w-110 items-center gap-4 rounded-md bg-surface-2 py-2.5 pr-2.5 pl-4 text-[15px] leading-5 text-ink shadow-float"
    >
      <span :class="t.tone === 'danger' && 'text-oxblood-ink'">{{ t.message }}</span>
      <button
        v-if="t.action"
        type="button"
        class="h-9 cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm font-medium text-sapphire-ink hover:bg-line"
        @click="(t.action.run(), dismiss(t.id))"
      >
        {{ t.action.label }}
      </button>
    </div>
  </div>
</template>
