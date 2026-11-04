<template>
  <ApSplit :sticky="false">
    <ApList>
      <ApListRow
        name="9V batteries"
        status="low"
        :qty="1"
        selected
      />

      <ApListRow
        name="AA batteries"
        :qty="12"
      />
    </ApList>

    <template #pane>
      <ApPanel>
        <h3 class="m-0 type-title">
          9V batteries
        </h3>
      </ApPanel>
    </template>
  </ApSplit>
</template>

<!-- At 960px and up the pane sits beside the list; below that it's hidden. -->
<script setup>
  import { ApList, ApListRow, ApPanel, ApSplit } from '@home/ui';
</script>
