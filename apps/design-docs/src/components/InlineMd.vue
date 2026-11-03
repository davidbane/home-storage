<script setup>
import { computed } from 'vue'

/** Renders `code` spans in a plain string. Nothing else: catalog text is trusted, short prose. */
const props = defineProps({ text: { type: String, required: true } })
const parts = computed(() => props.text.split('`').map((t, i) => ({ t, code: i % 2 === 1 })))
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <code v-if="p.code" class="rounded-sm bg-surface-2 px-1 py-px font-mono text-[0.9em]">{{ p.t }}</code>
    <template v-else>{{ p.t }}</template>
  </template>
</template>
