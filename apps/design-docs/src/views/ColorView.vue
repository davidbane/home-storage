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
      <ApSection
        v-for="group in allGroups"
        :key="group.title"
        :title="group.title"
      >
        <div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          <figure
            v-for="name in group.names"
            :key="name"
            class="m-0 overflow-hidden rounded-lg bg-surface-1 shadow-raised"
          >
            <div
              class="h-20 border-b border-line"
              :style="{ background: `var(--ap-${name})` }"
            />

            <figcaption class="flex flex-col gap-0.5 p-3">
              <code class="font-mono text-[13px] text-ink">{{ name }}</code>

              <span class="type-code text-ink-muted">{{ hex(name, theme) }}</span>

              <span
                v-if="byName.get(name)?.usage"
                class="type-meta text-ink-muted"
              >{{ byName.get(name)?.usage }}</span>
            </figcaption>
          </figure>
        </div>
      </ApSection>

      <ApSection title="Contrast">
        <p class="m-0 type-meta text-ink-muted">
          WCAG 2 ratios in the {{ themeName }} theme. Body text needs 4.5:1.
        </p>

        <div class="overflow-x-auto rounded-lg bg-surface-1 shadow-raised">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-line">
                <th
                  scope="col"
                  class="p-3 font-medium"
                >
                  Text on
                </th>

                <th
                  v-for="surface in surfaces"
                  :key="surface"
                  scope="col"
                  class="p-3 font-mono text-[13px] font-normal text-ink-muted"
                >
                  {{ surface }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="foreground in textTokens"
                :key="foreground"
                class="[&+&]:border-t [&+&]:border-line"
              >
                <th
                  scope="row"
                  class="p-3 font-normal"
                >
                  <span
                    :style="{ color: `var(--ap-${foreground})` }"
                    class="font-mono text-[13px]"
                  >{{ foreground }}</span>
                </th>

                <td
                  v-for="surface in surfaces"
                  :key="surface"
                  class="p-3"
                  :style="{ background: `var(--ap-${surface})` }"
                >
                  <span :style="{ color: `var(--ap-${foreground})` }">{{ ratio(foreground, surface).toFixed(1) }}</span>

                  <span
                    v-if="ratio(foreground, surface) < 4.5"
                    class="ml-1 text-oxblood-ink"
                  >below 4.5</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3">
          <div
            v-for="[foreground, background] in pairs"
            :key="foreground + background"
            class="flex items-center justify-between rounded-md px-4 py-3 text-sm"
            :style="{ background: `var(--ap-${background})`, color: `var(--ap-${foreground})` }"
          >
            <span class="font-mono text-[12px]">{{ foreground }} / {{ background }}</span>

            <span class="font-medium">{{ ratio(foreground, background).toFixed(1) }}</span>
          </div>
        </div>
      </ApSection>
    </div>
  </ApContainer>
</template>

<script setup>
  import { computed } from 'vue';
  import { ApContainer, ApPageHead, ApSection, useTheme } from '@home/ui';
  import { contrast, hex, tokens } from '@/tokens';

  const { theme } = useTheme();

  const groups = [
    { title: 'Surfaces and text', names: ['surface-0', 'surface-1', 'surface-2', 'line', 'line-strong', 'ink', 'ink-muted'] },
    { title: 'Action: sapphire', names: ['sapphire', 'sapphire-ink', 'sapphire-tint', 'on-sapphire', 'focus'] },
    { title: 'Ornament: brass', names: ['brass', 'brass-bright', 'brass-tint'] },
    { title: 'Status', names: ['oxblood', 'oxblood-ink', 'oxblood-tint', 'verdigris-ink', 'verdigris-tint'] },
    { title: 'Feature: bottle', names: ['bottle', 'on-bottle', 'brass-on-bottle'] },
  ];
  const byName = new Map(tokens.color.tokens.map((token) => [token.name, token]));
  const listed = new Set(groups.flatMap((group) => group.names));
  const rest = tokens.color.tokens.filter((token) => !listed.has(token.name)).map((token) => token.name);
  const allGroups = rest.length ? [...groups, { title: 'Other', names: rest }] : groups;

  const textTokens = ['ink', 'ink-muted', 'brass', 'sapphire-ink', 'oxblood-ink', 'verdigris-ink'];
  const surfaces = ['surface-0', 'surface-1', 'surface-2'];
  const pairs = [
    ['on-sapphire', 'sapphire'],
    ['sapphire-ink', 'sapphire-tint'],
    ['oxblood-ink', 'oxblood-tint'],
    ['verdigris-ink', 'verdigris-tint'],
    ['brass', 'brass-tint'],
    ['on-bottle', 'bottle'],
    ['brass-on-bottle', 'bottle'],
  ];
  const ratio = (foreground, background) => contrast(hex(foreground, theme.value), hex(background, theme.value));
  const themeName = computed(() => tokens.color.themes.find((candidate) => candidate.id === theme.value)?.name ?? theme.value);
</script>
