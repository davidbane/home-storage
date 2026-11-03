<template>
  <span
    :class="[base, tone[props.status]]"
  >{{ text }}</span>
</template>

<script setup>
  import { computed } from 'vue';
  import { statusLabel } from '../types';

  /** One of the four fixed statuses. The word is always shown; color is never the only signal. */
  const props = defineProps({
    status: { type: String, required: true, validator: (value) => value in statusLabel },
    label: String,
  });

  const tone = {
    low: 'bg-oxblood-tint text-oxblood-ink',
    surplus: 'bg-sapphire-tint text-sapphire-ink',
    long: 'bg-brass-tint text-brass',
    ok: 'bg-verdigris-tint text-verdigris-ink',
  };
  const text = computed(() => props.label ?? statusLabel[props.status]);
  const base = 'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 type-caption whitespace-nowrap before:size-1.5 before:rounded-full before:bg-current before:content-[\'\']';
</script>
