<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Crumb } from '../types'

/**
 * The location path: House / Room / Furniture / Container.
 * With `current`, the last crumb is the page you're on and doesn't link.
 */
defineProps<{ items: Crumb[]; current?: boolean }>()
</script>

<template>
  <nav aria-label="Location">
    <ol class="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 type-meta text-ink-muted">
      <li v-for="(c, i) in items" :key="i" class="flex items-center gap-1.5">
        <span v-if="i > 0" aria-hidden="true" class="text-line-strong">/</span>
        <span v-if="current && i === items.length - 1" aria-current="page" class="text-ink">{{ c.label }}</span>
        <RouterLink v-else-if="c.to" :to="c.to" class="text-ink-muted no-underline hover:text-ink">{{ c.label }}</RouterLink>
        <span v-else>{{ c.label }}</span>
      </li>
    </ol>
  </nav>
</template>
