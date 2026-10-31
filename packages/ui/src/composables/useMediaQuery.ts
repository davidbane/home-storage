import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useMediaQuery(query: string) {
  const matches = ref(typeof window !== 'undefined' && window.matchMedia(query).matches)
  let mql: MediaQueryList | undefined
  const update = (e: MediaQueryListEvent) => (matches.value = e.matches)
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
