<script setup lang="ts">
/**
 * Large-title header. Slots: back (phone only), eyebrow, meta, actions.
 * Title is display-xl on phones and display-2xl at 960px and up. Actions wrap under the title on phones.
 */
defineProps<{ title: string }>()
</script>

<template>
  <header class="flex flex-wrap items-end gap-x-6 gap-y-4 pt-4 pb-6 md:pt-8 md:pb-8">
    <div class="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
      <div v-if="$slots.back" class="md:hidden"><slot name="back" /></div>
      <slot name="eyebrow" />
      <h1 class="m-0 type-display-xl md:type-display-2xl">{{ title }}</h1>
      <slot name="meta" />
    </div>
    <div v-if="$slots.actions" class="flex flex-[1_1_360px] items-center justify-end gap-3">
      <slot name="actions" />
    </div>
  </header>
</template>
