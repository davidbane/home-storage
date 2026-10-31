<script setup lang="ts">
import { useId } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'

/** Labelled native select in a sunken well. Pass <option>/<optgroup> elements in the default slot. */
const model = defineModel<string | null>()
const props = defineProps<{ label: string; hint?: string; error?: string; required?: boolean }>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm leading-5 font-medium">
      {{ props.label }}<span v-if="!props.required" class="font-normal text-ink-muted"> (optional)</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        :required="props.required"
        :aria-invalid="props.error ? 'true' : undefined"
        :aria-describedby="props.error || props.hint ? `${id}-msg` : undefined"
        :class="[
          'h-12 w-full cursor-pointer appearance-none rounded-md border bg-surface-0 pr-10 pl-4 text-[15px] leading-[22px] text-ink shadow-sunken outline-none focus:border-sapphire-ink',
          props.error ? 'border-oxblood-ink' : 'border-line',
        ]"
      >
        <slot />
      </select>
      <IconChevronDown :size="18" stroke="1.5" aria-hidden="true" class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-muted" />
    </div>
    <p v-if="props.error" :id="`${id}-msg`" class="m-0 text-[13px] leading-[18px] text-oxblood-ink">{{ props.error }}</p>
    <p v-else-if="props.hint" :id="`${id}-msg`" class="m-0 type-meta text-ink-muted">{{ props.hint }}</p>
  </div>
</template>
