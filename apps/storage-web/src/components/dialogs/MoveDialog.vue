<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ApButton, ApDialog, useToast } from '@home/ui'
import PlaceSelect from '@/components/PlaceSelect.vue'
import { useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
const router = useRouter()
const { show } = useToast()

const it = computed(() => (ui.dialog?.kind === 'move' ? house.item(ui.dialog.itemId) : undefined))
const open = computed({ get: () => Boolean(it.value), set: (isOpen) => !isOpen && ui.close() })
const to = ref(null)
const error = ref('')
watch(open, (isOpen) => isOpen && ((to.value = null), (error.value = '')))

async function move() {
  const item = it.value
  if (!item) return
  if (!to.value) return void (error.value = 'Choose where it goes.')
  const from = item.location
  await house.moveItem(item.id, to.value)
  if (house.saveError) return void (error.value = `Couldn't move it: ${house.saveError}`)
  ui.close()
  // Follow the item to its new place.
  router.replace({ path: `/rooms/${house.roomOf(item.location)?.id}`, query: { in: item.location, item: item.id } })
  show(`Moved ${item.name} to ${house.location(item.location)?.name}`, { action: { label: 'Undo', run: () => house.moveItem(item.id, from) } })
}
</script>

<template>
  <ApDialog v-if="it" v-model:open="open" :title="`Move ${it.name}`" :description="`Now in ${house.pathText(it.location)}`">
    <form id="move-form" class="pb-2" novalidate @submit.prevent="move">
      <PlaceSelect v-model="to" label="Move to" :error="error" :exclude="it.location" />
    </form>
    <template #footer>
      <ApButton variant="ghost" @click="ui.close()">Cancel</ApButton>
      <ApButton variant="primary" type="submit" form="move-form">Move</ApButton>
    </template>
  </ApDialog>
</template>
