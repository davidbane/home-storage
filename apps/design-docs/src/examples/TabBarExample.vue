<script setup lang="ts">
import { IconAlertTriangle, IconHome, IconList, IconPlus, IconQrcode } from '@tabler/icons-vue'
import { ApFab, ApTab, ApTabBar } from '@home/ui'
</script>

<!-- In an app the tab bar floats at the bottom on phones and hides at 960px and up.
     The wrapper here pins it in place so you can see it at any width. -->
<template>
  <div class="max-w-110 [&>nav]:static! [&>nav]:flex! [&>nav]:w-full! [&>nav]:translate-x-0!">
    <ApTabBar>
      <ApTab to="/" label="Browse" active><template #icon><IconHome :size="22" stroke="1.5" /></template></ApTab>
      <ApTab to="/" label="Lists" :active="false"><template #icon><IconList :size="22" stroke="1.5" /></template></ApTab>
      <ApFab label="Add item"><IconPlus :size="22" stroke="1.75" /></ApFab>
      <ApTab to="/" label="Low" :active="false"><template #icon><IconAlertTriangle :size="22" stroke="1.5" /></template></ApTab>
      <ApTab to="/" label="Labels" :active="false"><template #icon><IconQrcode :size="22" stroke="1.5" /></template></ApTab>
    </ApTabBar>
  </div>
</template>
