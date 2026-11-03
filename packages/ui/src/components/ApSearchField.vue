<template>
  <label
    class="flex h-12 items-center gap-2.5 rounded-md border border-line bg-surface-0 px-4 text-ink-muted shadow-sunken focus-within:border-sapphire-ink"
  >
    <IconSearch
      :size="18"
      stroke="1.5"
      aria-hidden="true"
    />
    <input
      ref="input"
      v-model="model"
      type="search"
      :placeholder="props.placeholder"
      :aria-label="props.label"
      class="min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-[22px] text-ink outline-none placeholder:text-ink-muted"
    >
    <kbd
      v-if="props.shortcut"
      class="hidden rounded-sm border border-line px-1.5 py-px type-code md:inline"
    >/</kbd>
  </label>
</template>

<script setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { IconSearch } from '@tabler/icons-vue';

  /** Sunken search well. `shortcut` adds a "/" hint and focuses the field on that key (desktop). */
  const model = defineModel({ type: String, default: '' });
  const props = defineProps({
    placeholder: { type: String, default: 'Search the house' },
    label: { type: String, default: 'Search items and places' },
    shortcut: Boolean,
  });
  const input = ref();

  function onKey(event) {
    const target = event.target;
    if (event.key !== '/' || target?.closest('input, textarea, [contenteditable]')) {
      return;
    }
    event.preventDefault();
    input.value?.focus();
  }
  onMounted(() => props.shortcut && window.addEventListener('keydown', onKey));
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>
