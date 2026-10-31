<script setup lang="ts">
import { ApContainer, ApPageHead, ApSection } from '@home/ui'
import { tokens } from '@/tokens'

const fontVar = (family: string) => `var(--ap-font-${family})`
</script>

<template>
  <ApContainer>
    <ApPageHead title="Type">
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">
          Cormorant Garamond for headlines and big numbers, Inter for everything you read or tap, JetBrains Mono for bin codes. Each style is a Tailwind utility, like
          <code class="font-mono text-[0.9em]">type-meta</code>.
        </p>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-10">
      <ApSection v-for="g in tokens.type.groups" :key="g.name" :title="g.name">
        <div class="rounded-lg bg-surface-1 shadow-raised">
          <div v-for="s in g.styles" :key="s.name" class="grid gap-2 p-4 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-6 md:p-5 [&+&]:border-t [&+&]:border-line">
            <div class="flex flex-col gap-0.5">
              <code class="font-mono text-[13px]">type-{{ s.name }}</code>
              <span class="type-meta text-ink-muted">{{ s.fontSize }} / {{ s.lineHeight }} · {{ s.fontWeight }}{{ s.letterSpacing ? ` · ${s.letterSpacing}` : '' }}</span>
              <span v-if="s.usage" class="type-meta text-ink-muted">{{ s.usage }}</span>
            </div>
            <div
              class="min-w-0 overflow-hidden text-ellipsis"
              :style="{ fontFamily: fontVar(s.family ?? g.family), fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing }"
            >
              {{ s.sample ?? 'The quick brown fox' }}
            </div>
          </div>
        </div>
      </ApSection>

      <ApSection title="Numerals">
        <div class="flex flex-wrap items-baseline gap-8 rounded-lg bg-surface-1 p-5 shadow-raised">
          <div class="flex flex-col gap-1">
            <span class="type-numeral">0 1 2 3 4 5 6 7 8 9</span>
            <span class="type-meta text-ink-muted">Cormorant old-style figures: counts on tiles and the stepper</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[32px] leading-8 font-medium tabular-nums">0 1 2 3 4 5 6 7 8 9</span>
            <span class="type-meta text-ink-muted">Inter: quantities in lists and forms</span>
          </div>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>
