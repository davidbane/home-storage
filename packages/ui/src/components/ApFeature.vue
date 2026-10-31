<script setup lang="ts">
/** The one bottle-green surface per screen. Text only in on-bottle and brass-on-bottle. */
withDefaults(defineProps<{ as?: string }>(), { as: 'section' })
</script>

<template>
  <component
    :is="as"
    class="rounded-lg bg-bottle feature-wash p-4 text-on-bottle shadow-[inset_0_1px_0_#ffffff1f,0_2px_4px_#00000040,0_16px_32px_-12px_#00000080] md:px-7 md:py-6"
  >
    <slot />
  </component>
</template>
