<script setup>
import { ApContainer, ApList, ApListRow, ApPageHead, ApSection } from '@home/ui'
import { catalog, groups } from '@/catalog'
</script>

<template>
  <ApContainer>
    <ApPageHead title="Components">
      <template #meta>
        <p class="m-0 max-w-2xl text-[15px] leading-[22px] text-ink-muted">Everything is exported from <code class="font-mono text-[0.9em]">@home/ui</code>. Each page shows the component live, with the code it runs.</p>
      </template>
    </ApPageHead>
    <div class="flex flex-col gap-8 md:max-w-3xl">
      <ApSection v-for="g in groups" :key="g" :title="g">
        <ApList>
          <ApListRow v-for="e in catalog.filter((x) => x.group === g)" :key="e.slug" :name="e.name" :sub="e.summary.replace(/`/g, '')" :to="`/components/${e.slug}`" />
        </ApList>
      </ApSection>
    </div>
  </ApContainer>
</template>
