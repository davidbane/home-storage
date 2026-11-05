<template>
  <ApContainer>
    <ApPageHead title="Apothecary">
      <template #eyebrow>
        <span class="type-meta text-ink-muted">Design system for the home apps</span>
      </template>

      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">
          Bottle green and bone, a thread of brass, and one jewel-toned sapphire for everything you can press. The markdown guidelines live in
          <code class="font-mono text-[0.9em]">docs/design-system</code>.
        </p>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-10">
      <ApFeature class="grid grid-cols-2 gap-6 md:grid-cols-4">
        <ApStat
          :value="tokens.color.tokens.length"
          label="color tokens"
        />

        <ApStat
          :value="tokens.color.themes.length"
          label="themes"
        />

        <ApStat
          :value="tokens.type.groups.reduce((total, group) => total + group.styles.length, 0)"
          label="type styles"
        />

        <ApStat
          :value="catalog.length"
          label="components"
        />
      </ApFeature>

      <section class="flex flex-col gap-4">
        <h2 class="m-0 type-title md:text-[1.625rem]">
          Principles
        </h2>

        <ol class="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
          <li
            v-for="([title, text], index) in principles"
            :key="title"
            class="flex gap-4 rounded-lg bg-surface-1 sheen p-4 shadow-raised"
          >
            <span
              class="type-numeral text-brass"
              aria-hidden="true"
            >{{ index + 1 }}</span>

            <span class="flex flex-col gap-1">
              <span class="text-[15px] leading-5 font-medium">{{ title }}</span>

              <span class="type-meta text-ink-muted">{{ text }}</span>
            </span>
          </li>
        </ol>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="m-0 type-title md:text-[1.625rem]">
          Explore
        </h2>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="section in sections"
            :key="section.to"
            :to="section.to"
            class="flex flex-col gap-1 rounded-lg bg-surface-1 sheen p-5 text-ink no-underline shadow-raised transition duration-150 hover:-translate-y-0.5 hover:shadow-raised-hover"
          >
            <span class="type-title">{{ section.title }}</span>

            <span class="type-meta text-ink-muted">{{ section.text }}</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </ApContainer>
</template>

<script setup>
  import { RouterLink } from 'vue-router';
  import { ApContainer, ApFeature, ApPageHead, ApStat } from '@keep/ui';
  import { catalog } from '@/catalog';
  import { tokens } from '@/tokens';

  const principles = [
    ['Gothic in the voice, modern in the build', 'The palette and the EB Garamond display face carry the gothic. Everything else is contemporary app UI.'],
    ['Display face for headlines only', 'Item names, paths, counts, quantities and controls are Inter.'],
    ['Sapphire means "act"', 'The only interactive fill. One primary button per view. Nothing decorative is blue.'],
    ['Brass is a thread, not a frame', 'A hairline on bin tags, a hover edge on tiles. Never a button.'],
    ['Status is a fixed vocabulary', 'Low and Stocked: same word, color and dot everywhere.'],
    ['Depth is lit from above', 'Sunken for inputs, raised for cards and lists, floating for the tab bar and sheets.'],
  ];
  const sections = [
    { to: '/color', title: 'Color', text: 'Roles, both themes and live contrast checks.' },
    { to: '/type', title: 'Type', text: 'EB Garamond for display, Inter for everything you read.' },
    { to: '/shape', title: 'Space, shape and depth', text: 'The 4px scale, radii and the three depth levels.' },
    { to: '/layout', title: 'Layout', text: 'Breakpoints, navigation and page patterns.' },
    { to: '/components', title: 'Components', text: 'Every component, live, with its code.' },
  ];
</script>
