<script setup>
import { computed } from 'vue'
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-vue'
import { ApBreadcrumb, ApButton, ApIconButton, ApPanel, ApStatusChip, ApStepper } from '@home/ui'
import { status, useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
/**
 * One item's detail. `pane` is the desktop side panel; `body` is the content
 * of the phone item screen (its header and actions come from the room view).
 */
const props = defineProps({
  itemId: { type: String, required: true },
  variant: { type: String, required: true, validator: (value) => ['pane', 'body'].includes(value) },
})
defineEmits(['close'])

const it = computed(() => house.item(props.itemId))
const qty = computed({
  get: () => it.value?.quantity ?? 0,
  set: (quantity) => house.setQuantity(props.itemId, quantity),
})
const st = computed(() => (it.value ? status(it.value) : 'ok'))
const parLine = computed(() => {
  const item = it.value
  if (!item || item.par === null) return 'No par set'
  const difference = item.quantity - item.par
  return difference < 0 ? `${-difference} under par of ${item.par}` : difference === 0 ? `At par of ${item.par}` : `${difference} over par of ${item.par}`
})
const storageLabel = { daily: 'Daily use', surplus: 'Surplus store', long_term: 'Long-term' }
const fmt = (date) => new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const details = computed(() => {
  const item = it.value
  if (!item) return []
  return [
    ['Par', item.par !== null ? String(item.par) : undefined],
    ['Brand', item.brand],
    ['Used for', item.used_for],
    ['Storage', storageLabel[item.storage_class]],
    ['Bin', house.location(item.location)?.code],
    ['Moved from', item.moved_from],
  ].filter((row) => Boolean(row[1]))
})
</script>

<template>
  <component :is="variant === 'pane' ? ApPanel : 'div'" v-if="it" v-bind="variant === 'pane' ? { as: 'aside', 'aria-label': it.name } : {}" class="flex flex-col gap-6">
    <div v-if="variant === 'pane'" class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-col gap-2">
        <ApStatusChip :status="st" class="self-start" />
        <h2 class="m-0 font-display text-4xl leading-[2.375rem] font-semibold tracking-[-0.01em]">{{ it.name }}</h2>
        <ApBreadcrumb :items="house.crumbs(it.location, false)" />
      </div>
      <div class="flex flex-none gap-2">
        <ApIconButton label="Edit item" @click="ui.openEdit(it.id)"><IconPencil :size="18" stroke="1.5" aria-hidden="true" /></ApIconButton>
        <ApIconButton label="Close item" @click="$emit('close')"><IconX :size="18" stroke="1.5" aria-hidden="true" /></ApIconButton>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 rounded-md bg-surface-0 py-3.5 pr-3.5 pl-4.5 shadow-sunken">
      <div class="flex flex-col gap-0.5">
        <span class="text-[15px] leading-5 font-medium">On hand</span>
        <span :class="['type-meta', st === 'low' ? 'text-oxblood-ink' : 'text-ink-muted']">{{ parLine }}</span>
        <span v-if="house.saveError" role="alert" class="type-meta text-oxblood-ink">Couldn't save that change. Try again.</span>
      </div>
      <ApStepper v-model="qty" />
    </div>

    <section v-if="details.length" class="flex flex-col gap-3">
      <h3 class="m-0 type-title md:text-xl md:leading-6">Details</h3>
      <dl class="m-0 grid grid-cols-[6.5rem_minmax(0,1fr)] text-sm leading-5">
        <template v-for="([label, value], index) in details" :key="label">
          <dt :class="['py-2.5 text-ink-muted', index > 0 && 'border-t border-line']">{{ label }}</dt>
          <dd :class="['m-0 py-2.5', index > 0 && 'border-t border-line', label === 'Bin' && 'type-code leading-5']">{{ value }}</dd>
        </template>
      </dl>
    </section>

    <section v-if="it.history.length" class="flex flex-col gap-2">
      <h3 class="m-0 type-title md:text-xl md:leading-6">History</h3>
      <ul class="m-0 flex list-none flex-col gap-1.5 p-0 type-meta text-ink-muted">
        <li v-for="(entry, index) in it.history" :key="index" class="flex justify-between gap-4"><span>{{ entry.text }}</span><span class="whitespace-nowrap">{{ fmt(entry.date) }}</span></li>
      </ul>
    </section>

    <div v-if="variant === 'pane'" class="flex gap-2.5">
      <ApButton variant="ghost" aria-label="Remove item" title="Remove item" class="w-12 px-0! text-oxblood-ink!" @click="ui.openRemove(it.id)"><IconTrash :size="20" stroke="1.5" aria-hidden="true" /></ApButton>
      <ApButton class="flex-1" @click="ui.openMove(it.id)">Move</ApButton>
      <ApButton :variant="house.onList(it.id) ? 'tonal' : 'primary'" class="flex-2" :aria-pressed="house.onList(it.id)" @click="house.toggleList(it.id)">
        <template v-if="house.onList(it.id)" #icon><IconCheck :size="18" stroke="1.75" aria-hidden="true" /></template>
        {{ house.onList(it.id) ? 'On shopping list' : 'Add to shopping list' }}
      </ApButton>
    </div>
  </component>
</template>
