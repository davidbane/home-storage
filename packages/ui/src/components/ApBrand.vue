<script setup>
import ApLink from './ApLink.vue'

/** App name beside the arched bottle mark. */
defineProps({ name: { type: String, required: true }, to: [String, Object] })
</script>

<template>
  <ApLink :to="to" class="flex items-center gap-2.5 px-2 pt-1 font-display text-2xl leading-7 font-semibold text-ink no-underline">
    <span
      aria-hidden="true"
      class="h-8 w-7 flex-none rounded-[14px_14px_4px_4px] bg-bottle feature-wash shadow-[inset_0_1px_0_#ffffff1f,inset_0_0_0_1px_#c9a25e66]"
    ></span>
    {{ name }}
  </ApLink>
</template>
