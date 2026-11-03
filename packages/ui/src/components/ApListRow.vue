<script setup>
import ApLink from './ApLink.vue'
import ApStatusChip from './ApStatusChip.vue'

/**
 * One item in a list: name, a detail line, status and quantity.
 * `ok` status stays quiet in lists; only Low, Surplus and Long-term show a chip.
 */
const props = defineProps({
  name: { type: String, required: true },
  sub: String,
  status: { type: String, validator: (v) => ['low', 'surplus', 'long', 'ok'].includes(v) },
  qty: [Number, String],
  to: [String, Object],
  selected: Boolean,
})
</script>

<template>
  <li>
    <ApLink
      :to="props.to"
      :aria-current="props.selected ? 'true' : undefined"
      :class="[
        'flex min-h-15 items-center gap-3 px-4 text-ink no-underline transition-colors duration-150',
        props.to && 'hover:bg-surface-2',
        props.selected && 'bg-sapphire-tint shadow-[inset_3px_0_0_var(--color-sapphire-ink)] hover:bg-sapphire-tint',
      ]"
    >
      <span class="flex min-w-0 flex-1 flex-col py-2.5">
        <span class="truncate text-[15px] leading-5 font-medium">{{ props.name }}</span>
        <span v-if="props.sub || $slots.sub" class="truncate type-meta text-ink-muted"><slot name="sub">{{ props.sub }}</slot></span>
      </span>
      <ApStatusChip v-if="props.status && props.status !== 'ok'" :status="props.status" />
      <slot name="trailing">
        <span v-if="props.qty !== undefined" class="min-w-7 text-right text-[15px] leading-5 font-medium">{{ typeof props.qty === 'number' ? `×${props.qty}` : props.qty }}</span>
      </slot>
    </ApLink>
  </li>
</template>
