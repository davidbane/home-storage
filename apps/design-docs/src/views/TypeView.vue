<template>
  <ApContainer>
    <ApPageHead title="Type">
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">
          EB Garamond for headlines, Inter for everything you read or tap, JetBrains Mono for bin codes. Each style is a Tailwind utility, like
          <code class="font-mono text-[0.9em]">type-meta</code>.
        </p>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-10">
      <ApSection
        v-for="group in tokens.type.groups"
        :key="group.name"
        :title="group.name"
      >
        <div class="rounded-lg bg-surface-1 shadow-raised">
          <div
            v-for="style in group.styles"
            :key="style.name"
            class="grid gap-2 p-4 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-6 md:p-5 [&+&]:border-t [&+&]:border-line"
          >
            <div class="flex flex-col gap-0.5">
              <code class="font-mono text-[13px]">type-{{ style.name }}</code>

              <span class="type-meta text-ink-muted">{{ style.fontSize }} / {{ style.lineHeight }} · {{ style.fontWeight }}{{ style.letterSpacing ? ` · ${style.letterSpacing}` : '' }}</span>

              <span
                v-if="style.usage"
                class="type-meta text-ink-muted"
              >{{ style.usage }}</span>
            </div>

            <div
              class="min-w-0 overflow-hidden text-ellipsis"
              :style="{ fontFamily: fontVar(style.family ?? group.family), fontSize: style.fontSize, lineHeight: style.lineHeight, fontWeight: style.fontWeight, letterSpacing: style.letterSpacing }"
            >
              {{ style.sample ?? 'The quick brown fox' }}
            </div>
          </div>
        </div>
      </ApSection>

      <ApSection title="Numerals">
        <div class="flex flex-wrap items-baseline gap-8 rounded-lg bg-surface-1 p-5 shadow-raised">
          <div class="flex flex-col gap-1">
            <span class="type-numeral">0 1 2 3 4 5 6 7 8 9</span>

            <span class="type-meta text-ink-muted">Inter: counts on tiles and the stepper</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[32px] leading-8 font-medium tabular-nums">0 1 2 3 4 5 6 7 8 9</span>

            <span class="type-meta text-ink-muted">Inter, tabular: quantities in lists and forms</span>
          </div>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>

<script setup>
  import { ApContainer, ApPageHead, ApSection } from '@keep/ui';
  import { tokens } from '@/tokens';

  const fontVar = (family) => `var(--ap-font-${family})`;
</script>
