# Layout

The home apps are websites first and must hold up on a phone. One HTML structure serves every width; layout changes at three breakpoints (Tailwind `sm:`, `md:`, `lg:`).

| Width | Navigation | Layout | Titles |
|---|---|---|---|
| under 600px (phone) | Floating tab bar | One column, 20px gutters, actions in a bottom dock | 44px |
| 600–959px (`sm:`) | Tab bar, centered at 440px | One column, tiles grow | 44px |
| 960px and up (`md:`) | Sticky sidebar; tab bar hidden | Split views, two-column sections, content capped at 1200px | 60px |
| 1280px and up (`lg:`) | Sidebar | 48px gutters, wider detail pane | 60px |

`useIsDesktop()` is true at 960px and up, for the rare case behavior (not just layout) has to differ.

## The frame

```vue
<ApShell>
  <template #sidebar><AppSidebar /></template>   <!-- ApSidebar, desktop only -->
  <RouterView />
  <template #bottom><AppTabBar /></template>      <!-- ApTabBar, phones only -->
</ApShell>
<ApToaster />
```

Pages put their content in `ApContainer` and open with `ApPageHead`: a large title, an optional eyebrow (breadcrumb or greeting), meta (tags, counts) and actions. On phones the actions wrap under the title; a `#back` slot shows a back button on phones only.

## Patterns

**List and detail (`ApSplit`).** On desktop, choosing a row fills a sticky pane beside the list. On a phone, the same tap opens the item as its own screen. Keep one URL for both: the storage app uses `/rooms/:room?in=:container&item=:item`, and the pane and the phone screen render the same detail component.

**Actions by width.** Desktop puts a screen's actions in the page head or the pane. Phones put them in an `ApDock` pinned to the bottom, which replaces the tab bar on that screen (route `meta.dock`).

**Tiles reflow.** `ApTileGrid` with no `columns` fits as many tiles as the width allows, never under 100px each. Pass `columns` when the grid should mirror real furniture, like a 3-wide drawer chest.

**Lists stay lists.** Don't switch to tables on desktop; the grouped list reads fine at 700px wide.

**Same content, different arrangement.** Nothing is desktop-only except the sidebar's room shortcuts; on phones the same places are a tap away from Home.

## Dialogs

`ApDialog` is a centered panel on desktop and a bottom sheet on phones. Put the primary action last in the footer, a quiet Cancel before it, and a destructive action (if any) at the far left with `mr-auto`.

## Printing

`ApShell`'s sidebar, the tab bar, docks and toasts hide when printing, and the page background turns white. Mark other screen-only controls `print:hidden`, and give printed content `data-theme="parchment"`.
