<script setup lang="ts">
import { useRoute } from 'vue-router'
import { IconBox, IconHome, IconLayout, IconMoon, IconPalette, IconSun, IconTypography } from '@tabler/icons-vue'
import { ApBrand, ApButton, ApNavGroup, ApNavItem, ApShell, ApSidebar, ApTab, ApTabBar, ApToaster, useTheme } from '@home/ui'
import { catalog, groups } from '@/catalog'

const route = useRoute()
const { theme, toggle } = useTheme()
const icon = { size: 20, stroke: '1.5', 'aria-hidden': 'true' } as const
const tabIcon = { size: 22, stroke: '1.5', 'aria-hidden': 'true' } as const
</script>

<template>
  <ApShell>
    <template #sidebar>
      <ApSidebar label="Design system">
        <template #brand><ApBrand name="Apothecary" to="/" /></template>
        <ApNavGroup label="Foundations">
          <ApNavItem to="/" label="Overview" :active="route.path === '/'"><template #icon><IconHome v-bind="icon" /></template></ApNavItem>
          <ApNavItem to="/color" label="Color"><template #icon><IconPalette v-bind="icon" /></template></ApNavItem>
          <ApNavItem to="/type" label="Type"><template #icon><IconTypography v-bind="icon" /></template></ApNavItem>
          <ApNavItem to="/shape" label="Space, shape and depth"><template #icon><IconBox v-bind="icon" /></template></ApNavItem>
          <ApNavItem to="/layout" label="Layout"><template #icon><IconLayout v-bind="icon" /></template></ApNavItem>
        </ApNavGroup>
        <ApNavGroup v-for="g in groups" :key="g" :label="g">
          <ApNavItem v-for="e in catalog.filter((x) => x.group === g)" :key="e.slug" :to="`/components/${e.slug}`" :label="e.name" />
        </ApNavGroup>
        <template #footer>
          <ApButton variant="ghost" block class="justify-start! px-3!" @click="toggle">
            <template #icon><IconSun v-if="theme === 'night'" v-bind="icon" /><IconMoon v-else v-bind="icon" /></template>
            {{ theme === 'night' ? 'Parchment theme' : 'Night theme' }}
          </ApButton>
        </template>
      </ApSidebar>
    </template>

    <RouterView />

    <template #bottom>
      <ApTabBar label="Design system">
        <ApTab to="/" label="Overview" :active="route.path === '/'"><template #icon><IconHome v-bind="tabIcon" /></template></ApTab>
        <ApTab to="/color" label="Color"><template #icon><IconPalette v-bind="tabIcon" /></template></ApTab>
        <ApTab to="/type" label="Type"><template #icon><IconTypography v-bind="tabIcon" /></template></ApTab>
        <ApTab to="/components" label="Parts" :active="route.path.startsWith('/components')"><template #icon><IconBox v-bind="tabIcon" /></template></ApTab>
        <button
          type="button"
          :aria-label="theme === 'night' ? 'Switch to parchment theme' : 'Switch to night theme'"
          class="flex min-w-14 cursor-pointer flex-col items-center gap-0.5 rounded-pill border-0 bg-transparent px-2 py-1.5 text-[11px] leading-3.5 font-medium text-ink-muted"
          @click="toggle"
        >
          <IconSun v-if="theme === 'night'" v-bind="tabIcon" /><IconMoon v-else v-bind="tabIcon" />
          Theme
        </button>
      </ApTabBar>
    </template>
  </ApShell>
  <ApToaster />
</template>
