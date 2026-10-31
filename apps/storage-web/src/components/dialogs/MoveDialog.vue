<script setup lang="ts">
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
const open = computed({ get: () => Boolean(it.value), set: (v) => !v && ui.close() })
const to = ref<string | null>(null)
const error = ref('')
watch(open, (v) => v && ((to.value = null), (error.value = '')))

async function move() {
  const i = it.value
  if (!i) return
  if (!to.value) return void (error.value = 'Choose where it goes.')
  const from = i.location
  await house.moveItem(i.id, to.value)
  if (house.saveError) return void (error.value = `Couldn't move it: ${house.saveError}`)
  ui.close()
  // Follow the item to its new place.
  router.replace({ path: `/rooms/${house.roomOf(i.location)?.id}`, query: { in: i.location, item: i.id } })
  show(`Moved ${i.name} to ${house.location(i.location)?.name}`, { action: { label: 'Undo', run: () => house.moveItem(i.id, from) } })
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
