import { ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * Which app-level dialog is open. Views ask for one; App.vue renders it.
 * `dialog` is null or { kind, ...ids }, with kind one of: add, edit, move, remove, find,
 * room-add, room-edit, spot-add, spot-edit, place-remove.
 */
export const useUiStore = defineStore('ui', () => {
  const dialog = ref(null);
  return {
    dialog,
    openAdd: (location) => (dialog.value = { kind: 'add', location }),
    openEdit: (itemId) => (dialog.value = { kind: 'edit', itemId }),
    openMove: (itemId) => (dialog.value = { kind: 'move', itemId }),
    openRemove: (itemId) => (dialog.value = { kind: 'remove', itemId }),
    openFind: () => (dialog.value = { kind: 'find' }),
    openAddRoom: () => (dialog.value = { kind: 'room-add' }),
    openEditRoom: (id) => (dialog.value = { kind: 'room-edit', id }),
    openAddSpot: (parent) => (dialog.value = { kind: 'spot-add', parent }),
    openEditSpot: (id) => (dialog.value = { kind: 'spot-edit', id }),
    openRemovePlace: (id) => (dialog.value = { kind: 'place-remove', id }),
    close: () => (dialog.value = null),
  };
});
