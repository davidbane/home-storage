<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApButton, ApDialog, useToast } from '@home/ui'
import { useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const { show } = useToast()

const currentItem = computed(() => (ui.dialog?.kind === 'remove' ? house.item(ui.dialog.itemId) : undefined))
const open = computed({ get: () => Boolean(currentItem.value), set: (isOpen) => !isOpen && ui.close() })
const error = ref('')
watch(open, (isOpen) => isOpen && (error.value = ''))

async function remove() {
  const item = currentItem.value
  if (!item) return
  const place = house.location(item.location)?.name ?? 'the house'
  const restore = await house.removeItem(item.id)
  if (!restore) return void (error.value = `Couldn't remove it: ${house.saveError}`)
  ui.close()
  if (route.query.item === item.id) router.replace({ query: { ...route.query, item: undefined } })
  show(`Removed ${item.name} from ${place}`, { action: { label: 'Undo', run: () => void restore() } })
}
</script>

<template>
  <ApDialog v-if="currentItem" v-model:open="open" :title="`Remove ${currentItem.name}?`" :description="`It comes out of ${house.pathText(currentItem.location)} and off any lists.`">
    <p v-if="error" role="alert" class="m-0 pb-2 text-[13px] leading-[18px] text-oxblood-ink">{{ error }}</p>
    <template #footer>
      <ApButton variant="ghost" @click="ui.close()">Keep it</ApButton>
      <ApButton variant="danger" @click="remove">Remove</ApButton>
    </template>
  </ApDialog>
</template>
