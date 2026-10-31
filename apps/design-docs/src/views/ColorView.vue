<script setup lang="ts">
import { computed } from 'vue'
import { ApContainer, ApPageHead, ApSection, useTheme } from '@home/ui'
import { contrast, hex, tokens } from '@/tokens'

const { theme } = useTheme()

const groups = [
  { title: 'Surfaces and text', names: ['surface-0', 'surface-1', 'surface-2', 'line', 'line-strong', 'ink', 'ink-muted'] },
  { title: 'Action: sapphire', names: ['sapphire', 'sapphire-ink', 'sapphire-tint', 'on-sapphire', 'focus'] },
  { title: 'Ornament: brass', names: ['brass', 'brass-bright', 'brass-tint'] },
  { title: 'Status', names: ['oxblood', 'oxblood-ink', 'oxblood-tint', 'verdigris-ink', 'verdigris-tint'] },
  { title: 'Feature: bottle', names: ['bottle', 'on-bottle', 'brass-on-bottle'] },
]
const byName = new Map(tokens.color.tokens.map((t) => [t.name, t]))
const listed = new Set(groups.flatMap((g) => g.names))
const rest = tokens.color.tokens.filter((t) => !listed.has(t.name)).map((t) => t.name)
const allGroups = rest.length ? [...groups, { title: 'Other', names: rest }] : groups

const textTokens = ['ink', 'ink-muted', 'brass', 'sapphire-ink', 'oxblood-ink', 'verdigris-ink']
const surfaces = ['surface-0', 'surface-1', 'surface-2']
const pairs = [
  ['on-sapphire', 'sapphire'],
  ['sapphire-ink', 'sapphire-tint'],
  ['oxblood-ink', 'oxblood-tint'],
  ['verdigris-ink', 'verdigris-tint'],
  ['brass', 'brass-tint'],
  ['on-bottle', 'bottle'],
  ['brass-on-bottle', 'bottle'],
]
const ratio = (fg: string, bg: string) => contrast(hex(fg, theme.value), hex(bg, theme.value))
const themeName = computed(() => tokens.color.themes.find((t) => t.id === theme.value)?.name ?? theme.value)
</script>

<template>
  <ApContainer>
    <ApPageHead title="Color">
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">
          Showing the {{ themeName }} theme; switch themes to see the other. Swatches use the live CSS variables, so they're exactly what components render.
        </p>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-10">
      <ApSection v-for="g in allGroups" :key="g.title" :title="g.title">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          <figure v-for="n in g.names" :key="n" class="m-0 overflow-hidden rounded-lg bg-surface-1 shadow-raised">
            <div class="h-20 border-b border-line" :style="{ background: `var(--ap-${n})` }"></div>
            <figcaption class="flex flex-col gap-0.5 p-3">
              <code class="font-mono text-[13px] text-ink">{{ n }}</code>
              <span class="type-code text-ink-muted">{{ hex(n, theme) }}</span>
              <span v-if="byName.get(n)?.usage" class="type-meta text-ink-muted">{{ byName.get(n)?.usage }}</span>
            </figcaption>
          </figure>
        </div>
      </ApSection>

      <ApSection title="Contrast">
        <p class="m-0 type-meta text-ink-muted">WCAG 2 ratios in the {{ themeName }} theme. Body text needs 4.5:1.</p>
        <div class="overflow-x-auto rounded-lg bg-surface-1 shadow-raised">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-line">
                <th scope="col" class="p-3 font-medium">Text on</th>
                <th v-for="s in surfaces" :key="s" scope="col" class="p-3 font-mono text-[13px] font-normal text-ink-muted">{{ s }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fg in textTokens" :key="fg" class="[&+&]:border-t [&+&]:border-line">
                <th scope="row" class="p-3 font-normal"><span :style="{ color: `var(--ap-${fg})` }" class="font-mono text-[13px]">{{ fg }}</span></th>
                <td v-for="s in surfaces" :key="s" class="p-3" :style="{ background: `var(--ap-${s})` }">
                  <span :style="{ color: `var(--ap-${fg})` }">{{ ratio(fg, s).toFixed(1) }}</span>
                  <span v-if="ratio(fg, s) < 4.5" class="ml-1 text-oxblood-ink">below 4.5</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3">
          <div
            v-for="[fg, bg] in pairs"
            :key="fg + bg"
            class="flex items-center justify-between rounded-md px-4 py-3 text-sm"
            :style="{ background: `var(--ap-${bg})`, color: `var(--ap-${fg})` }"
          >
            <span class="font-mono text-[12px]">{{ fg }} / {{ bg }}</span>
            <span class="font-medium">{{ ratio(fg, bg).toFixed(1) }}</span>
          </div>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>
