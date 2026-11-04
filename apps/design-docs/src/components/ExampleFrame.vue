<template>
  <ApPanel
    :padded="false"
    class="overflow-hidden"
  >
    <div class="p-5 md:p-8">
      <component
        :is="Example"
        v-if="Example"
      />
    </div>

    <details class="border-t border-line">
      <summary class="flex min-h-11 cursor-pointer items-center px-5 text-sm font-medium text-sapphire-ink md:px-8">
        Show code
      </summary>

      <div class="px-3 pb-3 md:px-5 md:pb-5">
        <CodeBlock
          :code="code"
          :label="`${entry.name} example`"
        />
      </div>
    </details>
  </ApPanel>
</template>

<script setup>
  import { computed } from 'vue';
  import { ApPanel } from '@home/ui';
  import CodeBlock from './CodeBlock.vue';
  import { exampleFor, sourceFor } from '@/catalog';

  /** A live example with its source underneath; both come from the same file. */
  const props = defineProps({ entry: { type: Object, required: true } });
  const Example = computed(() => exampleFor(props.entry));
  const code = computed(() => sourceFor(props.entry).trim());
</script>
