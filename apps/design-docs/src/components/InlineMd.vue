<template>
  <template
    v-for="(part, index) in parts"
    :key="index"
  >
    <code
      v-if="part.code"
      class="rounded-sm bg-surface-2 px-1 py-px font-mono text-[0.9em]"
    >{{ part.text }}</code>

    <template v-else>
      {{ part.text }}
    </template>
  </template>
</template>

<script setup>
  import { computed } from 'vue';

  /** Renders `code` spans in a plain string. Nothing else: catalog text is trusted, short prose. */
  const props = defineProps({ text: { type: String, required: true } });
  const parts = computed(() => props.text.split('`').map((text, index) => ({ text, code: index % 2 === 1 })));
</script>
