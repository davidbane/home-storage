<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import ApLink from './ApLink.vue'

/** Round icon-only button. `label` is required: it's the accessible name. */
const props = withDefaults(
  defineProps<{ label: string; to?: RouteLocationRaw; href?: string; size?: 'md' | 'lg' }>(),
  { size: 'md' },
)
</script>

<template>
  <ApLink
    :to="props.to"
    :href="props.href"
    as="button"
    :type="!props.to && !props.href ? 'button' : undefined"
    :aria-label="props.label"
    :title="props.label"
    :class="[
      'inline-flex flex-none cursor-pointer items-center justify-center rounded-pill bg-surface-2 text-ink transition duration-150',
      'shadow-[inset_0_1px_0_#ffffff12,0_1px_2px_#0000004d] hover:bg-line active:translate-y-px',
      props.size === 'lg' ? 'size-12' : 'size-10',
    ]"
  >
    <slot />
  </ApLink>
</template>
