<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApButton, ApDialog, useToast } from '@home/ui'
import { useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

/** Confirms removing a room or storage spot. Places that still hold items can't be removed. */
const house = useHouseStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const { show } = useToast()

const place = computed(() => (ui.dialog?.kind === 'place-remove' ? house.location(ui.dialog.id) : undefined))
const open = computed({ get: () => Boolean(place.value), set: (v) => !v && ui.close() })
const contents = computed(() => (place.value ? house.contentsOf(place.value.id) : { items: 0, places: 0 }))
const error = ref('')
watch(open, (v) => v && (error.value = ''))

const description = computed(() => {
  const c = contents.value
  if (c.items) return `It still holds ${c.items} ${c.items === 1 ? 'item' : 'items'}. Move or remove them first.`
  if (c.places) return `This also removes the ${c.places} ${c.places === 1 ? 'place' : 'places'} inside it. It can't be undone.`
  return "It's empty. This can't be undone."
})

async function remove() {
  const p = place.value
  if (!p) return
  const parent = p.parent
  const wasRoom = p.kind === 'room'
  const ok = await house.removePlace(p.id)
  if (!ok) return void (error.value = house.saveError ?? "Couldn't remove it.")
  ui.close()
  if (wasRoom && route.params.roomId === p.id) router.replace('/')
  else if (route.query.in === p.id) router.replace({ query: { ...route.query, in: parent && house.location(parent)?.kind !== 'room' ? parent : undefined } })
  show(`Removed ${p.name}`)
}
</script>

<template>
  <ApDialog v-if="place" v-model:open="open" :title="`Remove ${place.name}?`" :description="description">
    <p v-if="error" role="alert" class="m-0 pb-2 text-[13px] leading-[18px] text-oxblood-ink">{{ error }}</p>
    <template #footer>
      <ApButton variant="ghost" @click="ui.close()">{{ contents.items ? 'Close' : 'Keep it' }}</ApButton>
      <ApButton v-if="!contents.items" variant="danger" @click="remove">Remove</ApButton>
    </template>
  </ApDialog>
</template>
