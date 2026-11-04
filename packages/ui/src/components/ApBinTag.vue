<template>
  <span class="inline-flex items-center gap-1.5 rounded-sm border border-brass py-[3px] pr-2.5 pl-1 text-[13px] leading-[18px] font-medium text-ink">
    <b class="border-r border-brass px-1.5 py-px type-code font-normal text-brass">{{ code }}</b>

    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
  /** A container's printed label: brass hairline, mono code. For bins and containers, not items. */
  defineProps({ code: { type: String, required: true }, label: String });
</script>
