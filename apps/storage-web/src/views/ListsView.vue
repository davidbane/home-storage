<script setup>
import { computed } from 'vue'
import { IconCheck, IconPlus, IconX } from '@tabler/icons-vue'
import { ApButton, ApContainer, ApIconButton, ApList, ApListRow, ApPageHead, ApSection, useToast } from '@home/ui'
import { status, useHouseStore } from '@/stores/house'

const house = useHouseStore()
const { show } = useToast()

const suggestions = computed(() => house.lowItems.filter((i) => !house.onList(i.id)))
const need = (i) => (i.par !== null ? `${i.quantity} of ${i.par}` : `×${i.quantity}`)

async function bought(i) {
  const undo = await house.markBought(i.id)
  if (undo) show(`Restocked ${i.name} to ${i.quantity}`, { action: { label: 'Undo', run: () => void undo() } })
}
function addAll() {
  suggestions.value.forEach((i) => house.toggleList(i.id))
}
function clear() {
  const ids = [...house.shopping]
  house.shopping = []
  show('Cleared the list', { action: { label: 'Undo', run: () => (house.shopping = ids) } })
}
</script>

<template>
  <ApContainer>
    <ApPageHead title="Shopping list">
      <template #meta>
        <span class="type-meta text-ink-muted">{{ house.shoppingItems.length ? `${house.shoppingItems.length} to buy` : 'Nothing to buy' }}</span>
      </template>
      <template v-if="house.shoppingItems.length" #actions>
        <ApButton variant="ghost" @click="clear">Clear list</ApButton>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-8 md:max-w-3xl">
      <ApList v-if="house.shoppingItems.length" label="To buy">
        <ApListRow v-for="i in house.shoppingItems" :key="i.id" :name="i.name" :sub="house.pathText(i.location)" :status="status(i)">
          <template #trailing>
            <span class="type-meta whitespace-nowrap text-ink-muted">{{ need(i) }}</span>
            <ApButton class="h-10! px-3.5!" @click="bought(i)"><template #icon><IconCheck :size="18" stroke="1.75" aria-hidden="true" /></template>Bought</ApButton>
            <ApIconButton :label="`Take ${i.name} off the list`" @click="house.toggleList(i.id)"><IconX :size="18" stroke="1.5" aria-hidden="true" /></ApIconButton>
          </template>
        </ApListRow>
      </ApList>
      <p v-else class="m-0 rounded-md bg-surface-1 px-4 py-5 text-[15px] text-ink-muted shadow-raised">
        Your list is empty. Add items from their detail page, or from what's running low below.
      </p>

      <ApSection v-if="suggestions.length" title="Running low">
        <template #aside>
          <button type="button" class="cursor-pointer border-0 bg-transparent p-0 text-[13px] leading-[18px] font-medium text-sapphire-ink hover:underline md:text-sm" @click="addAll">Add all</button>
        </template>
        <ApList>
          <ApListRow v-for="i in suggestions" :key="i.id" :name="i.name" :sub="house.pathText(i.location)">
            <template #trailing>
              <span class="type-meta whitespace-nowrap text-oxblood-ink">{{ need(i) }}</span>
              <ApButton class="h-10! px-3.5!" @click="house.toggleList(i.id)"><template #icon><IconPlus :size="18" stroke="1.75" aria-hidden="true" /></template>Add</ApButton>
            </template>
          </ApListRow>
        </ApList>
      </ApSection>
    </div>
  </ApContainer>
</template>
