<script setup>
import ApLink from './ApLink.vue'

/**
 * A place that holds things, under the lancet arch, led by its item count.
 * Arched things are places: nothing else in the system uses this shape.
 */
const props = defineProps({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  meta: String,
  metaTone: { type: String, validator: (value) => ['muted', 'alert'].includes(value) },
  to: [String, Object],
  selected: Boolean,
})
</script>

<template>
  <ApLink
    :to="props.to"
    :aria-current="props.selected ? 'true' : undefined"
    :class="[
      'flex min-w-0 flex-col items-center gap-0.5 rounded-arch-top border px-2 pt-5 pb-3 text-center no-underline transition duration-150 md:pt-8 md:pb-5',
      props.selected
        ? '-translate-y-0.5 border-sapphire-ink bg-sapphire-tint text-sapphire-ink shadow-raised-hover'
        : 'border-transparent bg-surface-1 sheen text-ink shadow-raised hover:-translate-y-0.5 hover:border-brass hover:shadow-raised-hover',
    ]"
  >
    <span :class="['type-numeral md:text-[2.5rem] md:leading-11', props.count === 0 && !props.selected && 'text-ink-muted']">{{ props.count }}</span>
    <span class="text-sm leading-5 font-medium">{{ props.name }}</span>
    <span
      v-if="props.meta"
      :class="['type-caption font-normal', props.selected ? 'text-sapphire-ink' : props.metaTone === 'alert' ? 'text-oxblood-ink' : 'text-ink-muted']"
      >{{ props.meta }}</span
    >
  </ApLink>
</template>
