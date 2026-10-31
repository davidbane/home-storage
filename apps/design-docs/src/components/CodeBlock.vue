<script setup lang="ts">
import { IconCopy } from '@tabler/icons-vue'
import { useToast } from '@home/ui'

const props = defineProps<{ code: string; label?: string }>()
const { show } = useToast()

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    show('Copied')
  } catch {
    show("Couldn't copy. Select the code instead.", { tone: 'danger' })
  }
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      :aria-label="`Copy ${label ?? 'code'}`"
      class="absolute top-2 right-2 inline-flex size-9 cursor-pointer items-center justify-center rounded-md border-0 bg-surface-2 text-ink-muted hover:text-ink"
      @click="copy"
    >
      <IconCopy :size="16" stroke="1.5" aria-hidden="true" />
    </button>
    <pre class="m-0 overflow-x-auto rounded-md bg-surface-0 p-4 pr-14 font-mono text-[13px] leading-5 text-ink shadow-sunken"><code>{{ code }}</code></pre>
  </div>
</template>
