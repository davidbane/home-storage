import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useMediaQuery(query) {
  const matches = ref(typeof window !== 'undefined' && window.matchMedia(query).matches)
  let mql
  const update = (e) => (matches.value = e.matches)
  onMounted(() => {
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', update)
  })
  onBeforeUnmount(() => mql?.removeEventListener('change', update))
  return matches
}

/** True at the desktop breakpoint (bp-md, 960px): sidebar, split panes, page-head actions. */
export const useIsDesktop = () => useMediaQuery('(min-width: 60rem)')
