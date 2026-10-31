<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { IconArrowLeft } from '@tabler/icons-vue'
import { ApBreadcrumb, ApButton, ApContainer, ApIconButton, ApPageHead, ApSection } from '@home/ui'
import ExampleFrame from '@/components/ExampleFrame.vue'
import InlineMd from '@/components/InlineMd.vue'
import { catalog } from '@/catalog'

const route = useRoute()
const entry = computed(() => catalog.find((e) => e.slug === route.params.slug))
const index = computed(() => (entry.value ? catalog.indexOf(entry.value) : -1))
const prev = computed(() => catalog[index.value - 1])
const next = computed(() => catalog[index.value + 1])
</script>

<template>
  <ApContainer v-if="entry">
    <ApPageHead :title="entry.name">
      <template #back>
        <ApIconButton label="All components" to="/components"><IconArrowLeft :size="20" stroke="1.5" aria-hidden="true" /></ApIconButton>
      </template>
      <template #eyebrow>
        <ApBreadcrumb :items="[{ label: 'Components', to: '/components' }, { label: entry.group }]" />
      </template>
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted"><InlineMd :text="entry.summary" /></p>
      </template>
    </ApPageHead>

    <div class="flex flex-col gap-8">
      <ExampleFrame :key="entry.slug" :entry="entry" />

      <ApSection v-if="entry.rules?.length" title="Rules">
        <ul class="m-0 flex flex-col gap-2 pl-5 text-[15px] leading-[22px]">
          <li v-for="r in entry.rules" :key="r"><InlineMd :text="r" /></li>
        </ul>
      </ApSection>

      <p class="m-0 type-meta text-ink-muted">Props and full guidance: <code class="font-mono">docs/design-system/components.md</code></p>

      <nav aria-label="More components" class="flex flex-wrap justify-between gap-3 border-t border-line pt-6">
        <ApButton v-if="prev" variant="ghost" :to="`/components/${prev.slug}`">← {{ prev.name }}</ApButton>
        <span v-else></span>
        <ApButton v-if="next" variant="ghost" :to="`/components/${next.slug}`">{{ next.name }} →</ApButton>
      </nav>
    </div>
  </ApContainer>
  <ApContainer v-else>
    <ApPageHead title="Not found" />
    <ApButton to="/components">All components</ApButton>
  </ApContainer>
</template>
