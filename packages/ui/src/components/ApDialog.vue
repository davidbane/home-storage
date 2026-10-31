<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from 'vue'
import { IconX } from '@tabler/icons-vue'

/**
 * Modal built on the native <dialog>: focus is trapped, Escape closes it, and the
 * page behind is inert. A centered panel on desktop, a bottom sheet on phones.
 * Slots: default (body), footer (actions; put the primary action last).
 */
const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ title: string; description?: string }>()
const emit = defineEmits<{ closed: [] }>()

const el = ref<HTMLDialogElement>()
const titleId = useId()
const descId = useId()

async function sync(v: boolean) {
  await nextTick()
  const d = el.value
  if (!d) return
  if (v && !d.open) d.showModal()
  if (!v && d.open) d.close()
}
watch(open, sync)
onMounted(() => sync(open.value))

function onClose() {
  open.value = false
  emit('closed')
}
// A click whose target is the <dialog> itself landed on the backdrop.
function onClick(e: MouseEvent) {
  if (e.target === el.value) open.value = false
}
</script>

<template>
  <dialog
    ref="el"
    :aria-labelledby="titleId"
    :aria-describedby="props.description ? descId : undefined"
    class="m-auto mb-0 w-full max-w-none rounded-t-lg border-0 bg-surface-1 p-0 text-ink shadow-sheet backdrop:bg-[#0000009e] md:mb-auto md:w-[min(32rem,calc(100vw-2rem))] md:rounded-lg"
    @close="onClose"
    @click="onClick"
  >
    <div class="flex max-h-[85dvh] flex-col">
      <header class="flex items-start justify-between gap-4 px-5 pt-5 pb-3 md:px-6 md:pt-6">
        <div class="flex min-w-0 flex-col gap-1">
          <h2 :id="titleId" class="m-0 type-title">{{ props.title }}</h2>
          <p v-if="props.description" :id="descId" class="m-0 type-meta text-ink-muted">{{ props.description }}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          class="inline-flex size-10 flex-none cursor-pointer items-center justify-center rounded-pill border-0 bg-surface-2 text-ink hover:bg-line"
          @click="open = false"
        >
          <IconX :size="18" stroke="1.5" aria-hidden="true" />
        </button>
      </header>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-2 md:px-6"><slot /></div>
      <footer v-if="$slots.footer" class="flex flex-wrap justify-end gap-2.5 px-5 pt-3 pb-6 md:px-6"><slot name="footer" /></footer>
    </div>
  </dialog>
</template>
