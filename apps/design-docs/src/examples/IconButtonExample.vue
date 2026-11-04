<template>
  <div class="flex items-center gap-3">
    <ApIconButton label="Back">
      <IconArrowLeft
        :size="20"
        stroke="1.5"
      />
    </ApIconButton>

    <ApIconButton label="Edit item">
      <IconPencil
        :size="20"
        stroke="1.5"
      />
    </ApIconButton>

    <ApIconButton
      label="Find a bin"
      size="lg"
    >
      <IconScan
        :size="20"
        stroke="1.5"
      />
    </ApIconButton>
  </div>
</template>

<script setup>
  import { IconArrowLeft, IconPencil, IconScan } from '@tabler/icons-vue';
  import { ApIconButton } from '@keep/ui';
</script>
