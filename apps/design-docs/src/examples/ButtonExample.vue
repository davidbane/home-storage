<template>
  <div class="flex flex-wrap items-center gap-3">
    <ApButton variant="primary">
      <template #icon>
        <IconPlus
          :size="18"
          stroke="1.75"
        />
      </template>Add item
    </ApButton>

    <ApButton>Move</ApButton>

    <ApButton variant="ghost">
      Cancel
    </ApButton>

    <ApButton variant="danger">
      <template #icon>
        <IconTrash
          :size="18"
          stroke="1.5"
        />
      </template>Remove
    </ApButton>
  </div>
</template>

<script setup>
  import { IconPlus, IconTrash } from '@tabler/icons-vue';
  import { ApButton } from '@keep/ui';
</script>
