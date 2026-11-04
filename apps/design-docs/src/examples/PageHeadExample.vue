<template>
  <ApPageHead title="Hall closet">
    <template #back>
      <ApIconButton label="Back">
        <IconArrowLeft
          :size="20"
          stroke="1.5"
        />
      </ApIconButton>
    </template>

    <template #eyebrow>
      <ApBreadcrumb
        :items="[{ label: 'The House', to: '/' }, { label: 'Hall closet' }]"
        current
      />
    </template>

    <template #meta>
      <div class="flex flex-wrap items-center gap-2.5">
        <ApBinTag
          code="C-07"
          label="Oak drawer chest"
        />

        <span class="type-meta text-ink-muted">41 items · 1 low</span>
      </div>
    </template>

    <template #actions>
      <ApButton>
        <template #icon>
          <IconPlus
            :size="18"
            stroke="1.75"
          />
        </template>Add storage
      </ApButton>
    </template>
  </ApPageHead>
</template>

<script setup>
  import { IconArrowLeft, IconPlus } from '@tabler/icons-vue';
  import { ApBinTag, ApBreadcrumb, ApButton, ApIconButton, ApPageHead } from '@keep/ui';
</script>
