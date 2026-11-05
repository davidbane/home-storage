<template>
  <div class="max-w-110 [&>nav]:static! [&>nav]:flex! [&>nav]:w-full! [&>nav]:translate-x-0!">
    <ApTabBar>
      <ApTab
        to="/"
        label="Browse"
        active
      >
        <template #icon>
          <IconHome
            :size="22"
            stroke="1.5"
          />
        </template>
      </ApTab>

      <ApTab
        to="/"
        label="Low"
        :active="false"
      >
        <template #icon>
          <IconAlertTriangle
            :size="22"
            stroke="1.5"
          />
        </template>
      </ApTab>

      <ApFab label="Add item">
        <IconPlus
          :size="22"
          stroke="1.75"
        />
      </ApFab>

      <ApTab
        to="/"
        label="Print labels"
        :active="false"
      >
        <template #icon>
          <IconQrcode
            :size="22"
            stroke="1.5"
          />
        </template>
      </ApTab>

      <ApTab
        to="/"
        label="Settings"
        :active="false"
      >
        <template #icon>
          <IconSettings
            :size="22"
            stroke="1.5"
          />
        </template>
      </ApTab>
    </ApTabBar>
  </div>
</template>

<!-- In an app the tab bar floats at the bottom on phones and hides at 960px and up.
     The wrapper here pins it in place so you can see it at any width. -->
<script setup>
  import { IconAlertTriangle, IconHome, IconPlus, IconQrcode, IconSettings } from '@tabler/icons-vue';
  import { ApFab, ApTab, ApTabBar } from '@keep/ui';
</script>
