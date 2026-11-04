<template>
  <ApContainer>
    <ApPageHead title="Space, shape and depth" />

    <div class="flex flex-col gap-10">
      <ApSection title="Spacing">
        <p class="m-0 type-meta text-ink-muted">
          A 4px scale that matches Tailwind's: space-5 is p-5, 20px.
        </p>

        <div class="flex flex-col gap-2 rounded-lg bg-surface-1 p-5 shadow-raised">
          <div
            v-for="token in tokens.spacing.tokens"
            :key="token.name"
            class="grid grid-cols-[6rem_3.5rem_minmax(0,1fr)] items-center gap-3"
          >
            <code class="font-mono text-[13px]">{{ token.name }}</code>

            <span class="type-meta text-ink-muted">{{ token.value }}</span>

            <span
              class="h-3 rounded-sm bg-sapphire"
              :style="{ width: `var(--ap-${token.name})` }"
            />
          </div>
        </div>
      </ApSection>

      <ApSection title="Radius">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4">
          <figure
            v-for="token in tokens.radius.tokens"
            :key="token.name"
            class="m-0 flex flex-col gap-2"
          >
            <div
              class="h-24 border border-brass bg-surface-1 shadow-raised"
              :style="{ borderRadius: token.name === 'radius-arch' ? `var(--ap-radius-arch) var(--ap-radius-arch) var(--ap-radius-md) var(--ap-radius-md)` : `var(--ap-${token.name})` }"
            />

            <figcaption class="flex flex-col">
              <code class="font-mono text-[13px]">{{ token.name }}</code>

              <span class="type-meta text-ink-muted">{{ token.value }}</span>
            </figcaption>
          </figure>
        </div>
      </ApSection>

      <ApSection title="Depth">
        <p class="m-0 type-meta text-ink-muted">
          Lit from above. {{ tokens.shadow.note }}
        </p>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-6 rounded-lg bg-surface-0 p-6">
          <figure
            v-for="token in tokens.shadow.tokens"
            :key="token.name"
            class="m-0 flex flex-col gap-3"
          >
            <div
              class="h-24 rounded-lg"
              :class="token.name === 'shadow-glow' ? 'bg-sapphire' : token.name === 'shadow-sunken' ? 'bg-surface-0' : 'bg-surface-1'"
              :style="{ boxShadow: `var(--ap-${token.name})` }"
            />

            <figcaption class="flex flex-col">
              <code class="font-mono text-[13px]">{{ token.name }}</code>

              <span class="type-meta text-ink-muted">{{ depthNotes[token.name] ?? token.usage }}</span>
            </figcaption>
          </figure>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>

<script setup>
  import { ApContainer, ApPageHead, ApSection } from '@keep/ui';
  import { tokens } from '@/tokens';

  const depthNotes = {
    'shadow-sunken': 'Sunken: inputs, search, the stepper track',
    'shadow-raised': 'Raised: cards, lists, tiles, panels',
    'shadow-raised-hover': 'Raised, on hover: with a 2px lift',
    'shadow-glow': 'Sapphire fills only',
    'shadow-float': 'Floating: the tab bar',
    'shadow-dock': 'Floating: bottom docks, casting up',
    'shadow-sheet': 'Floating: dialogs and sheets',
  };
</script>
