<script setup>
import { computed } from 'vue'
import { ApContainer, ApPageHead, ApSection, useMediaQuery } from '@home/ui'

const sm = useMediaQuery('(min-width: 37.5rem)')
const md = useMediaQuery('(min-width: 60rem)')
const lg = useMediaQuery('(min-width: 80rem)')
const now = computed(() => (lg.value ? 'lg' : md.value ? 'md' : sm.value ? 'sm' : 'base'))

const rows = [
  { bp: 'base', width: 'under 600px', nav: 'Floating tab bar', layout: 'One column, 20px gutters, actions in a bottom dock', title: '44px' },
  { bp: 'sm', width: '600px and up', nav: 'Tab bar, centered at 440px', layout: 'One column, tiles grow', title: '44px' },
  { bp: 'md', width: '960px and up', nav: 'Sticky sidebar; tab bar hidden', layout: 'Split views, two-column sections, 1200px max', title: '60px' },
  { bp: 'lg', width: '1280px and up', nav: 'Sidebar', layout: '48px gutters, wider detail pane', title: '60px' },
]
const patterns = [
  ['List and detail', 'On desktop a row opens in a sticky pane beside the list (ApSplit). On a phone the same tap opens the item as its own screen. One URL for both.'],
  ['Actions by width', 'Desktop puts actions in the page head or pane. Phones put them in an ApDock, which replaces the tab bar on that screen.'],
  ['Tiles reflow', 'ApTileGrid fits as many tiles as the width allows, never under 100px. Pass columns to mirror real furniture.'],
  ['Lists stay lists', "Don't switch to tables on desktop; the grouped list reads fine at 700px wide."],
  ['Dialogs', 'Centered on desktop, a bottom sheet on phones. Primary action last.'],
  ['Printing', 'Sidebar, tab bar, docks and toasts hide. Give printed content data-theme="parchment".'],
]
</script>

<template>
  <ApContainer>
    <ApPageHead title="Layout">
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">One structure for every width, changing at three breakpoints. Resize the window to see this site do it.</p>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-10">
      <ApSection title="Breakpoints">
        <div class="overflow-x-auto rounded-lg bg-surface-1 shadow-raised">
          <table class="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-line">
                <th scope="col" class="p-3 font-medium">Prefix</th>
                <th scope="col" class="p-3 font-medium">Width</th>
                <th scope="col" class="p-3 font-medium">Navigation</th>
                <th scope="col" class="p-3 font-medium">Layout</th>
                <th scope="col" class="p-3 font-medium">Titles</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in rows"
                :key="r.bp"
                :aria-current="r.bp === now ? 'true' : undefined"
                :class="['[&+&]:border-t [&+&]:border-line', r.bp === now && 'bg-sapphire-tint text-sapphire-ink']"
              >
                <th scope="row" class="p-3 font-mono text-[13px] font-normal">{{ r.bp === 'base' ? '(none)' : `${r.bp}:` }}</th>
                <td class="p-3">{{ r.width }}{{ r.bp === now ? ' · you are here' : '' }}</td>
                <td class="p-3">{{ r.nav }}</td>
                <td class="p-3">{{ r.layout }}</td>
                <td class="p-3">{{ r.title }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ApSection>

      <ApSection title="Patterns">
        <div class="grid gap-3 md:grid-cols-2">
          <div v-for="[t, d] in patterns" :key="t" class="flex flex-col gap-1 rounded-lg bg-surface-1 sheen p-4 shadow-raised">
            <span class="text-[15px] leading-5 font-medium">{{ t }}</span>
            <span class="type-meta text-ink-muted">{{ d }}</span>
          </div>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>
