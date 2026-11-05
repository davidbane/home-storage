<template>
  <div
    class="inline-flex items-center gap-1 rounded-pill bg-surface-0 p-1 shadow-sunken"
    role="group"
    aria-label="Quantity"
  >
    <button
      type="button"
      :class="buttonClass"
      :aria-label="props.decrementLabel"
      :disabled="model <= props.min"
      @click="set(model - 1)"
    >
      <IconMinus
        :size="18"
        stroke="1.75"
        aria-hidden="true"
      />
    </button>

    <output
      class="min-w-10 text-center type-numeral"
      aria-live="polite"
    >{{ model }}</output>

    <button
      type="button"
      :class="buttonClass"
      :aria-label="props.incrementLabel"
      :disabled="model >= props.max"
      @click="set(model + 1)"
    >
      <IconPlus
        :size="18"
        stroke="1.75"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script setup>
  import { IconMinus, IconPlus } from '@tabler/icons-vue';

  /** Adjust a count in place. Raised buttons in a sunken track; the count is a large numeral. */
  const model = defineModel({ type: Number, required: true });
  const props = defineProps({
    min: { type: Number, default: 0 },
    max: { type: Number, default: Infinity },
    decrementLabel: { type: String, default: 'Use one' },
    incrementLabel: { type: String, default: 'Add one' },
  });
  const set = (count) => (model.value = Math.min(props.max, Math.max(props.min, count)));
  const buttonClass
    = 'inline-flex size-10 cursor-pointer items-center justify-center rounded-pill border-0 bg-surface-1 sheen text-ink shadow-raised transition duration-150 hover:bg-line active:translate-y-px disabled:cursor-default disabled:opacity-50';
</script>
