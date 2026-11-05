<template>
  <ApLink
    :to="props.to"
    :aria-current="props.selected ? 'true' : undefined"
    :class="[
      'flex min-w-0 flex-col gap-1 rounded-md border p-3 text-left no-underline transition duration-150',
      props.selected
        ? '-translate-y-0.5 border-sapphire-ink bg-sapphire-tint text-sapphire-ink shadow-raised-hover'
        : 'border-transparent bg-surface-1 sheen text-ink shadow-raised hover:-translate-y-0.5 hover:border-brass hover:shadow-raised-hover',
    ]"
  >
    <span class="type-body-strong">{{ props.name }}</span>

    <span
      v-if="props.count > 0"
      class="flex flex-wrap items-baseline gap-x-1"
    >
      <span class="type-numeral tabular-nums">{{ props.count }}</span>

      <span :class="['type-meta', !props.selected && 'text-ink-muted']">{{ props.count === 1 ? 'item' : 'items' }}</span>
    </span>

    <span
      v-else
      :class="['type-meta', !props.selected && 'text-ink-muted']"
    >Empty</span>

    <span
      v-if="props.meta"
      :class="['type-caption font-normal', props.selected ? 'text-sapphire-ink' : props.metaTone === 'alert' ? 'text-oxblood-ink' : 'text-ink-muted']"
    >{{ props.meta }}</span>
  </ApLink>
</template>

<script setup>
  import ApLink from './ApLink.vue';

  /**
   * A place that holds things: its name, how many items are inside, then a short note.
   */
  const props = defineProps({
    name: { type: String, required: true },
    count: { type: Number, required: true },
    meta: String,
    metaTone: { type: String, validator: (value) => ['muted', 'alert'].includes(value) },
    to: [String, Object],
    selected: Boolean,
  });
</script>
