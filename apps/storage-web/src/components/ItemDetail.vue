<script setup lang="ts">
import { computed } from 'vue'
import { IconTrash, IconX } from '@tabler/icons-vue'
import { ApBreadcrumb, ApButton, ApIconButton, ApPanel, ApStatusChip, ApStepper } from '@home/ui'
import { crumbs, item as getItem, location, setQuantity, status } from '@/api/house'

/**
 * One item's detail. `pane` is the desktop side panel; `body` is the content
 * of the phone item screen (its header and actions come from the room view).
 */
const props = defineProps<{ itemId: string; variant: 'pane' | 'body' }>()
defineEmits<{ close: [] }>()

const it = computed(() => getItem(props.itemId))
const qty = computed({
  get: () => it.value?.quantity ?? 0,
  set: (v: number) => setQuantity(props.itemId, v),
})
const st = computed(() => (it.value ? status(it.value) : 'ok'))
const parLine = computed(() => {
  const i = it.value
  if (!i || i.par === null) return 'No par set'
  const d = i.quantity - i.par
  return d < 0 ? `${-d} under par of ${i.par}` : d === 0 ? `At par of ${i.par}` : `${d} over par of ${i.par}`
})
const storageLabel = { daily: 'Daily use', surplus: 'Surplus store', long_term: 'Long-term' } as const
const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const details = computed(() => {
  const i = it.value
  if (!i) return []
  return [
    ['Brand', i.brand],
    ['Used for', i.used_for],
    ['Storage', storageLabel[i.storage_class]],
    ['Bin', location(i.location)?.code],
    ['Moved from', i.moved_from],
  ].filter((r): r is [string, string] => Boolean(r[1]))
})
</script>

<template>
  <component :is="variant === 'pane' ? ApPanel : 'div'" v-if="it" v-bind="variant === 'pane' ? { as: 'aside', 'aria-label': it.name } : {}" class="flex flex-col gap-6">
    <div v-if="variant === 'pane'" class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-col gap-2">
        <ApStatusChip :status="st" class="self-start" />
        <h2 class="m-0 font-display text-4xl leading-[2.375rem] font-semibold tracking-[-0.01em]">{{ it.name }}</h2>
        <ApBreadcrumb :items="crumbs(it.location, false)" />
      </div>
      <ApIconButton label="Close item" @click="$emit('close')"><IconX :size="18" :stroke="1.5" aria-hidden="true" /></ApIconButton>
    </div>

    <div class="flex items-center justify-between gap-4 rounded-md bg-surface-0 py-3.5 pr-3.5 pl-4.5 shadow-sunken">
      <div class="flex flex-col gap-0.5">
        <span class="text-[15px] leading-5 font-medium">On hand</span>
        <span :class="['type-meta', st === 'low' ? 'text-oxblood-ink' : 'text-ink-muted']">{{ parLine }}</span>
      </div>
      <ApStepper v-model="qty" />
    </div>

    <section v-if="details.length" class="flex flex-col gap-3">
      <h3 class="m-0 type-title md:text-xl md:leading-6">Details</h3>
      <dl class="m-0 grid grid-cols-[6.5rem_minmax(0,1fr)] text-sm leading-5">
        <template v-for="([k, v], i) in details" :key="k">
          <dt :class="['py-2.5 text-ink-muted', i > 0 && 'border-t border-line']">{{ k }}</dt>
          <dd :class="['m-0 py-2.5', i > 0 && 'border-t border-line', k === 'Bin' && 'type-code leading-5']">{{ v }}</dd>
        </template>
      </dl>
    </section>

    <section v-if="it.history.length" class="flex flex-col gap-2">
      <h3 class="m-0 type-title md:text-xl md:leading-6">History</h3>
      <ul class="m-0 flex list-none flex-col gap-1.5 p-0 type-meta text-ink-muted">
        <li v-for="e in it.history" :key="e.date + e.text" class="flex justify-between gap-4"><span>{{ e.text }}</span><span class="whitespace-nowrap">{{ fmt(e.date) }}</span></li>
      </ul>
    </section>

    <div v-if="variant === 'pane'" class="flex gap-2.5">
      <ApButton variant="ghost" aria-label="Remove item" class="w-12 px-0! text-oxblood-ink!"><IconTrash :size="20" :stroke="1.5" aria-hidden="true" /></ApButton>
      <ApButton class="flex-1">Move</ApButton>
      <ApButton variant="primary" class="flex-2">Add to shopping list</ApButton>
    </div>
  </component>
</template>
