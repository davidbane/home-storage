import { ref } from 'vue'
import { defineStore } from 'pinia'

export type DialogState =
  | { kind: 'add'; location?: string }
  | { kind: 'edit'; itemId: string }
  | { kind: 'move'; itemId: string }
  | { kind: 'remove'; itemId: string }
  | { kind: 'find' }
  | { kind: 'room-add' }
  | { kind: 'room-edit'; id: string }
  | { kind: 'spot-add'; parent: string }
  | { kind: 'spot-edit'; id: string }
  | { kind: 'place-remove'; id: string }

/** Which app-level dialog is open. Views ask for one; App.vue renders it. */
export const useUiStore = defineStore('ui', () => {
  const dialog = ref<DialogState | null>(null)
  return {
    dialog,
    openAdd: (location?: string) => (dialog.value = { kind: 'add', location }),
    openEdit: (itemId: string) => (dialog.value = { kind: 'edit', itemId }),
    openMove: (itemId: string) => (dialog.value = { kind: 'move', itemId }),
    openRemove: (itemId: string) => (dialog.value = { kind: 'remove', itemId }),
    openFind: () => (dialog.value = { kind: 'find' }),
    openAddRoom: () => (dialog.value = { kind: 'room-add' }),
    openEditRoom: (id: string) => (dialog.value = { kind: 'room-edit', id }),
    openAddSpot: (parent: string) => (dialog.value = { kind: 'spot-add', parent }),
    openEditSpot: (id: string) => (dialog.value = { kind: 'spot-edit', id }),
    openRemovePlace: (id: string) => (dialog.value = { kind: 'place-remove', id }),
    close: () => (dialog.value = null),
  }
})
