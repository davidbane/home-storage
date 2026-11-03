<template>
  <ApSection
    title="Needs attention"
    link-label="See all"
    link-to="/"
    class="max-w-md"
  >
    <ApList>
      <ApListRow
        name="9V batteries"
        sub="Hall closet / Drawer B"
        status="low"
        :qty="1"
      />
      <ApListRow
        name="Paper towels"
        sub="Garage / Shelf 3"
        status="surplus"
        :qty="14"
      />
    </ApList>
  </ApSection>
</template>

<script setup>
  import { ApList, ApListRow, ApSection } from '@home/ui';
</script>
