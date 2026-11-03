<script setup>
/**
 * Responsive tile grid. Default `auto` reflows by width (never under 100px a tile).
 * Pass `columns` to mirror real furniture, like a 3-wide drawer chest.
 */
defineProps({ columns: { type: Number, validator: (value) => [2, 3, 4].includes(value) } })
const fixed = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }
</script>

<template>
  <div
    :class="[
      'grid gap-2.5 sm:gap-3 md:gap-4',
      columns ? fixed[columns] : 'grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(132px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(152px,1fr))]',
    ]"
  >
    <slot />
  </div>
</template>
