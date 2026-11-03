<script setup>
import { useId } from 'vue'

/** Labelled text or number input in a sunken well. Shows `error` under the field when set. */
const model = defineModel({ type: [String, Number] })
const props = defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'text', validator: (v) => ['text', 'number', 'search'].includes(v) },
  placeholder: String,
  hint: String,
  error: String,
  required: Boolean,
  maxlength: Number,
  min: Number,
  inputmode: { type: String, validator: (v) => ['text', 'numeric', 'decimal'].includes(v) },
  autofocus: Boolean,
})
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm leading-5 font-medium">
      {{ props.label }}<span v-if="!props.required" class="font-normal text-ink-muted"> (optional)</span>
    </label>
    <input
      :id="id"
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      :required="props.required"
      :maxlength="props.maxlength"
      :min="props.min"
      :inputmode="props.inputmode"
      :autofocus="props.autofocus"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-describedby="props.error || props.hint ? `${id}-msg` : undefined"
      :class="[
        'h-12 w-full rounded-md border bg-surface-0 px-4 text-[15px] leading-[22px] text-ink shadow-sunken outline-none placeholder:text-ink-muted focus:border-sapphire-ink',
        props.error ? 'border-oxblood-ink' : 'border-line',
      ]"
    />
    <p v-if="props.error" :id="`${id}-msg`" class="m-0 text-[13px] leading-[18px] text-oxblood-ink">{{ props.error }}</p>
    <p v-else-if="props.hint" :id="`${id}-msg`" class="m-0 type-meta text-ink-muted">{{ props.hint }}</p>
  </div>
</template>
