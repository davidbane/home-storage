import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useMediaQuery(query) {
  const matches = ref(typeof window !== 'undefined' && window.matchMedia(query).matches);
  let mediaQueryList;
  const update = (event) => (matches.value = event.matches);
  onMounted(() => {
    mediaQueryList = window.matchMedia(query);
    matches.value = mediaQueryList.matches;
    mediaQueryList.addEventListener('change', update);
  });
  onBeforeUnmount(() => mediaQueryList?.removeEventListener('change', update));
  return matches;
}

/** True at the desktop breakpoint (bp-md, 960px): sidebar, split panes, page-head actions. */
export const useIsDesktop = () => useMediaQuery('(min-width: 60rem)');
