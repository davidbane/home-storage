import { ref, watch } from 'vue'
import type { Theme } from '../types'

const KEY = 'ap-theme'
const read = (): Theme | null => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'night' || v === 'parchment' ? v : null
  } catch {
    return null
  }
}

// One shared ref, so every caller sees the same theme.
const theme = ref<Theme>(read() ?? 'night')

watch(
  theme,
  (t) => {
    if (typeof document !== 'undefined') document.documentElement.dataset.theme = t
    try {
      localStorage.setItem(KEY, t)
    } catch {
      /* private mode or blocked storage: the theme still applies for this visit */
    }
  },
  { immediate: true },
)

/** Night is the default identity; parchment is the daylight theme. Persists per browser. */
export function useTheme() {
  const toggle = () => (theme.value = theme.value === 'night' ? 'parchment' : 'night')
  return { theme, toggle }
}
