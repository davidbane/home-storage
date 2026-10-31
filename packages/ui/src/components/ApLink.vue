<script setup lang="ts">
// Internal: renders a RouterLink, an <a>, or a fallback element, so components
// can take `to`, `href`, or neither without repeating the branching.
import { RouterLink, type RouteLocationRaw } from 'vue-router'

withDefaults(defineProps<{ to?: RouteLocationRaw; href?: string; as?: string }>(), { as: 'div' })
</script>

<template>
  <RouterLink v-if="to" :to="to"><slot /></RouterLink>
  <a v-else-if="href" :href="href"><slot /></a>
  <component :is="as" v-else><slot /></component>
</template>
