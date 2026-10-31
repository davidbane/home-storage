<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/** A tab in ApTabBar: icon over a short label. Active tab is a sapphire-tint pill. */
const props = defineProps<{ to: RouteLocationRaw; label: string; active?: boolean }>()
</script>

<template>
  <RouterLink v-slot="{ href, navigate, isActive }" :to="props.to" custom>
    <a
      :href="href"
      :aria-current="(props.active ?? isActive) ? 'page' : undefined"
      :class="[
        'flex min-w-14 flex-col items-center gap-0.5 rounded-pill px-2 py-1.5 text-[11px] leading-3.5 font-medium no-underline',
        (props.active ?? isActive) ? 'bg-sapphire-tint text-sapphire-ink' : 'text-ink-muted',
      ]"
      @click="navigate"
    >
      <slot name="icon" />
      {{ props.label }}
    </a>
  </RouterLink>
</template>
