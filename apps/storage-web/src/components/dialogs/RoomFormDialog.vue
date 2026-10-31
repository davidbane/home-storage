<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ApButton, ApDialog, ApTextField, useToast } from '@home/ui'
import { useHouseStore } from '@/stores/house'
import { useUiStore } from '@/stores/ui'

const house = useHouseStore()
const ui = useUiStore()
const router = useRouter()
const { show } = useToast()

const editing = computed(() => (ui.dialog?.kind === 'room-edit' ? house.location(ui.dialog.id) : undefined))
const open = computed({
  get: () => ui.dialog?.kind === 'room-add' || (ui.dialog?.kind === 'room-edit' && Boolean(editing.value)),
  set: (v) => !v && ui.close(),
})
const form = reactive({ name: '', note: '' })
const error = ref('')
watch(open, (v) => {
  if (!v) return
  error.value = ''
  form.name = editing.value?.name ?? ''
  form.note = editing.value?.note ?? ''
})

async function save() {
  if (!form.name.trim()) return void (error.value = 'Enter a name.')
  const draft = { name: form.name.trim(), note: form.note.trim() || undefined }
  const room = editing.value
  if (room) {
    await house.updateRoom(room.id, draft)
    if (house.saveError) return
    ui.close()
    show(`Saved ${draft.name}`)
  } else {
    const added = await house.addRoom(draft)
    if (!added) return
    ui.close()
    router.push(`/rooms/${added.id}`)
    show(`Added ${added.name}`)
  }
}
</script>

<template>
  <ApDialog v-model:open="open" :title="editing ? `Edit ${editing.name}` : 'Add a room'">
    <form id="room-form" class="flex flex-col gap-4 pb-2" novalidate @submit.prevent="save">
      <ApTextField v-model="form.name" label="Name" required :maxlength="50" placeholder="Hall closet" :error="error" autofocus />
      <ApTextField v-model="form.note" label="Description" placeholder="Under the stairs" />
      <p v-if="house.saveError" role="alert" class="m-0 text-[13px] leading-[18px] text-oxblood-ink">Couldn't save: {{ house.saveError }}</p>
    </form>
    <template #footer>
      <ApButton v-if="editing" variant="ghost" class="mr-auto text-oxblood-ink!" @click="ui.openRemovePlace(editing.id)">Remove room</ApButton>
      <ApButton variant="ghost" @click="ui.close()">Cancel</ApButton>
      <ApButton variant="primary" type="submit" form="room-form">{{ editing ? 'Save changes' : 'Add room' }}</ApButton>
    </template>
  </ApDialog>
</template>
