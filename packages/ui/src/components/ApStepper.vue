<script setup lang="ts">
import { IconMinus, IconPlus } from '@tabler/icons-vue'

/** Adjust a count in place. Raised buttons in a sunken track; the count is a display numeral. */
const model = defineModel<number>({ required: true })
const props = withDefaults(
  defineProps<{ min?: number; max?: number; decrementLabel?: string; incrementLabel?: string }>(),
  { min: 0, max: Infinity, decrementLabel: 'Use one', incrementLabel: 'Add one' },
)
const set = (n: number) => (model.value = Math.min(props.max, Math.max(props.min, n)))
const btn =
  'inline-flex size-10 cursor-pointer items-center justify-center rounded-pill border-0 bg-surface-1 sheen text-ink shadow-raised transition duration-150 hover:bg-line active:translate-y-px disabled:cursor-default disabled:opacity-50'
</script>

<template>
  <div class="inline-flex items-center gap-1 rounded-pill bg-surface-0 p-1 shadow-sunken" role="group" aria-label="Quantity">
    <button type="button" :class="btn" :aria-label="props.decrementLabel" :disabled="model <= props.min" @click="set(model - 1)">
      <IconMinus :size="18" stroke="1.75" aria-hidden="true" />
    </button>
    <output class="min-w-10 text-center type-numeral" aria-live="polite">{{ model }}</output>
    <button type="button" :class="btn" :aria-label="props.incrementLabel" :disabled="model >= props.max" @click="set(model + 1)">
      <IconPlus :size="18" stroke="1.75" aria-hidden="true" />
    </button>
  </div>
</template>
