<template>
  <nav
    :aria-label="label ?? 'Main'"
    class="sticky top-0 box-border flex h-dvh w-sidebar flex-col gap-2 overflow-y-auto bg-surface-1 px-4 py-6 shadow-[inset_-1px_0_0_var(--color-line),8px_0_24px_-16px_#00000066]"
  >
    <slot name="brand" />
    <slot />
    <div
      v-if="$slots.footer"
      class="mt-auto"
    >
      <slot name="footer" />
    </div>
  </nav>
</template>

<script setup>
  /** Desktop navigation. Slots: brand, default (ApNavGroup), footer. Hidden under 960px by ApShell. */
  defineProps({ label: String });
</script>
