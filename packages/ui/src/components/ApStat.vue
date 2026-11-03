<template>
  <div class="flex flex-col gap-0.5 md:gap-1">
    <span class="font-display text-4xl leading-none font-medium text-on-bottle md:text-[2.75rem]">{{ value }}</span>
    <span class="type-meta text-brass-on-bottle md:text-sm md:leading-5">{{ label }}</span>
  </div>
</template>

<script setup>
  /** A headline number for ApFeature: display numeral over a brass caption. */
  defineProps({ value: { type: [Number, String], required: true }, label: { type: String, required: true } });
</script>
