<template>
  <label class="inline-flex min-h-11 cursor-pointer items-center gap-3 select-none">
    <span class="relative inline-flex size-5 flex-none">
      <input
        v-model="model"
        type="checkbox"
        class="peer absolute inset-0 m-0 cursor-pointer opacity-0"
      >

      <span
        aria-hidden="true"
        class="inline-flex size-5 items-center justify-center rounded-[5px] border border-line-strong bg-surface-0 text-on-sapphire shadow-sunken peer-checked:border-sapphire peer-checked:bg-sapphire peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
      >
        <IconCheck
          v-if="model"
          :size="14"
          stroke="2.5"
        />
      </span>
    </span>

    <span
      v-if="label || $slots.default"
      class="text-[15px] leading-5"
    ><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup>
  import { IconCheck } from '@tabler/icons-vue';

  /** Checkbox with its label. The native input stays in place for keyboard and screen readers. */
  const model = defineModel({ type: Boolean, default: false });
  defineProps({ label: String });
</script>
