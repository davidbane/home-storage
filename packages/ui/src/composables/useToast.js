import { ref } from 'vue'

/**
 * @typedef {object} Toast
 * @property {number} id
 * @property {string} message
 * @property {{ label: string, run: () => void }} [action] One optional action, e.g. "Undo" or "View".
 * @property {'default' | 'danger'} [tone]
 */

const toasts = ref([])
let next = 1

function dismiss(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

/**
 * Show a short confirmation. Pair with <ApToaster /> once, near the app root.
 * `opts` takes `action`, `tone` and `duration` (ms).
 */
function show(message, opts = {}) {
  const id = next++
  const { duration = opts.action ? 6000 : 3500, ...rest } = opts
  toasts.value = [...toasts.value.slice(-2), { id, message, ...rest }]
  setTimeout(() => dismiss(id), duration)
  return id
}

export function useToast() {
  return { toasts, show, dismiss }
}
