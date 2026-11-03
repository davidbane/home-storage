<template>
  <RouterLink
    v-if="to"
    :to="to"
  ><slot /></RouterLink>
  <a
    v-else-if="href"
    :href="href"
  ><slot /></a>
  <component
    :is="as"
    v-else
  >
    <slot />
  </component>
</template>

<script setup>
  // Internal: renders a RouterLink, an <a>, or a fallback element, so components
  // can take `to`, `href`, or neither without repeating the branching.
  import { RouterLink } from 'vue-router';

  defineProps({ to: [String, Object], href: String, as: { type: String, default: 'div' } });
</script>
