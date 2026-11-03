<template>
  <ApContainer>
    <ApPageHead title="Components">
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">
          Everything is exported from <code class="font-mono text-[0.9em]">@home/ui</code>. Each page shows the component live, with the code it runs.
        </p>
      </template>
    </ApPageHead>
    <div class="flex flex-col gap-8 md:max-w-3xl">
      <ApSection
        v-for="group in groups"
        :key="group"
        :title="group"
      >
        <ApList>
          <ApListRow
            v-for="entry in catalog.filter((candidate) => candidate.group === group)"
            :key="entry.slug"
            :name="entry.name"
            :sub="entry.summary.replace(/`/g, '')"
            :to="`/components/${entry.slug}`"
          />
        </ApList>
      </ApSection>
    </div>
  </ApContainer>
</template>

<script setup>
  import { ApContainer, ApList, ApListRow, ApPageHead, ApSection } from '@home/ui';
  import { catalog, groups } from '@/catalog';
</script>
