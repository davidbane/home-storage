<template>
  <ApTabBar>
    <ApTab
      to="/"
      label="Browse"
    >
      <template #icon>
        <IconHome v-bind="icon" />
      </template>
    </ApTab>

    <ApTab
      to="/low"
      label="Low"
    >
      <template #icon>
        <IconAlertTriangle v-bind="icon" />
      </template>
    </ApTab>

    <ApFab
      label="Add item"
      @click="ui.openAdd()"
    >
      <IconPlus
        :size="22"
        stroke="1.75"
        aria-hidden="true"
      />
    </ApFab>

    <ApTab
      to="/labels"
      label="Print labels"
    >
      <template #icon>
        <IconQrcode v-bind="icon" />
      </template>
    </ApTab>

    <ApTab
      to="/settings"
      label="Settings"
    >
      <template #icon>
        <IconSettings v-bind="icon" />
      </template>
    </ApTab>
  </ApTabBar>
</template>

<script setup>
  import { IconAlertTriangle, IconHome, IconPlus, IconQrcode, IconSettings } from '@tabler/icons-vue';
  import { ApFab, ApTab, ApTabBar } from '@keep/ui';
  import { useUiStore } from '@/stores/ui';

  const ui = useUiStore();

  const icon = { 'size': 22, 'stroke': '1.5', 'aria-hidden': 'true' };
</script>
