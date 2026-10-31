import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  /** One optional action, e.g. "Undo" or "View". */
  action?: { label: string; run: () => void }
  tone?: 'default' | 'danger'
}

const toasts = ref<Toast[]>([])
let next = 1

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

/** Show a short confirmation. Pair with <ApToaster /> once, near the app root. */
function show(message: string, opts: Omit<Toast, 'id' | 'message'> & { duration?: number } = {}) {
  const id = next++
  const { duration = opts.action ? 6000 : 3500, ...rest } = opts
  toasts.value = [...toasts.value.slice(-2), { id, message, ...rest }]
  setTimeout(() => dismiss(id), duration)
  return id
}

export function useToast() {
  return { toasts, show, dismiss }
}
