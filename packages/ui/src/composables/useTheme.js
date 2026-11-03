import { ref, watch } from 'vue'
const KEY = 'ap-theme'
const read = () => {
  try {
    const stored = localStorage.getItem(KEY)
    return stored === 'night' || stored === 'parchment' ? stored : null
  } catch {
    return null
  }
}

// One shared ref, so every caller sees the same theme.
const theme = ref(read() ?? 'night')

watch(
  theme,
  (current) => {
    if (typeof document !== 'undefined') document.documentElement.dataset.theme = current
    try {
      localStorage.setItem(KEY, current)
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
