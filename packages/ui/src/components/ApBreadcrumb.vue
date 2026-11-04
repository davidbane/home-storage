<template>
  <nav aria-label="Location">
    <ol class="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 type-meta text-ink-muted">
      <li
        v-for="(crumb, index) in items"
        :key="index"
        class="flex items-center gap-1.5"
      >
        <span
          v-if="index > 0"
          aria-hidden="true"
          class="text-line-strong"
        >/</span>

        <span
          v-if="current && index === items.length - 1"
          aria-current="page"
          class="text-ink"
        >{{ crumb.label }}</span>

        <RouterLink
          v-else-if="crumb.to"
          :to="crumb.to"
          class="text-ink-muted no-underline hover:text-ink"
        >{{ crumb.label }}</RouterLink>

        <span v-else>{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
  import { RouterLink } from 'vue-router';

  /**
   * The location path: House / Room / Furniture / Container.
   * Each item is { label, to? }.
   * With `current`, the last crumb is the page you're on and doesn't link.
   */
  defineProps({ items: { type: Array, required: true }, current: Boolean });
</script>
