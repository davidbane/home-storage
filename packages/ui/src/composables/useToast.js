import { ref } from 'vue';

/**
 * @typedef {object} Toast
 * @property {number} id
 * @property {string} message
 * @property {{ label: string, run: () => void }} [action] One optional action, e.g. "Undo" or "View".
 * @property {'default' | 'danger'} [tone]
 */

const toasts = ref([]);
let next = 1;

function dismiss(id) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

/**
 * Show a short confirmation. Pair with <ApToaster /> once, near the app root.
 * `opts` takes `action`, `tone` and `duration` (ms).
 */
function show(message, options = {}) {
  const id = next++;
  const { duration = options.action ? 6000 : 3500, ...rest } = options;
  toasts.value = [...toasts.value.slice(-2), { id, message, ...rest }];
  setTimeout(() => dismiss(id), duration);
  return id;
}

export function useToast() {
  return { toasts, show, dismiss };
}
