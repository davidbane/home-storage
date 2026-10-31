# Components

Everything is exported from `@home/ui`. Each component has a live example in the docs app (`yarn docs`); the code shown there is the example's source. Components take `to` (a Vue Router location) or `href` wherever they can navigate.

## Actions

### ApButton

The standard button, or a link when given `to` or `href`.

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'tonal' \| 'ghost' \| 'danger'` | `'tonal'` |
| `to` / `href` | route location / URL | |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `block` | `boolean`: full width | `false` |

Slots: default (label), `icon` (leading icon).

- **One `primary` per view.** It's sapphire with a glow; everything else is `tonal` or `ghost`.
- `danger` (oxblood) only for removal, and only behind a confirmation that names what's removed.
- Labels are verbs in sentence case. 48px tall.

### ApIconButton

Round icon-only button, 40px (`size="lg"`: 48px). **`label` is required**: it's the accessible name and the tooltip.

### ApFab

The round sapphire add button in the center of the tab bar. `label` required; emits `click`.

## Status and labels

### ApStatusChip

`status`: `'low' | 'surplus' | 'long' | 'ok'`, shown as Low, Surplus, Long-term, Stocked with a dot. `label` overrides the word only when you must. The app decides the status (the storage app's `status()` in `stores/house.ts`); the chip only displays it. In lists, leave Stocked out: show a chip only when it says something.

### ApBinTag

A container's printed label: a brass hairline box with a mono `code` and a `label` (or default slot). For bins and containers, not items. At most one per heading.

### ApBreadcrumb

`items: { label, to? }[]`. With `current`, the last crumb is the page you're on and doesn't link. Separators are `/`. On phones past four levels, collapse the middle rather than truncating the last crumb.

## Content

### ApList and ApListRow

A grouped list on a raised surface. Each row:

| Prop | Type |
|---|---|
| `name` | `string` |
| `sub` | `string`: detail line (or `#sub` slot) |
| `status` | `Status`: chip shown unless `ok` |
| `qty` | `number` (shown as ×n) or `string` |
| `to` | makes the whole row a link |
| `selected` | sapphire tint and edge, for the row open in a pane |

The `#trailing` slot replaces the quantity, e.g. for row buttons. Don't put buttons in a row that has `to`: the whole row is a link. Rows are at least 60px tall.

### ApLocationTile and ApTileGrid

A place that holds things, under the arch, led by its count. Props: `name`, `count`, `meta` (a short line), `metaTone` (`'alert'` turns it oxblood, e.g. "1 low"), `to`, `selected`. Only places get the arch.

`ApTileGrid` reflows by width; pass `columns` (2, 3 or 4) to mirror real furniture.

### ApFeature and ApStat

The one bottle-green surface per screen, holding `ApStat`s (`value`, `label`): a Cormorant numeral over a brass caption. Text inside uses only `on-bottle` and `brass-on-bottle`.

### ApPanel

A raised surface for grouped controls or a detail pane. `as` sets the element (default `section`); `padded` (default true).

## Forms

### ApTextField

`v-model`, `label` (required), `type`, `placeholder`, `hint`, `error`, `required`, `maxlength`, `min`, `inputmode`, `autofocus`. A sunken well. Fields without `required` show "(optional)" after the label. An `error` replaces the hint, turns the border oxblood and is announced to screen readers.

- Placeholders are real examples ("AA batteries"), not instructions.
- Validate on submit, not as people type; say what to do ("Enter a whole number, 0 or more.").

### ApSelect

Same shape as `ApTextField` around a native `<select>`; put `<option>` and `<optgroup>` in the default slot.

### ApCheckbox

`v-model` boolean, with a `label` or default slot. The native checkbox stays in place for keyboard and screen readers; the whole row is a 44px target.

### ApSearchField

`v-model`, `placeholder`, `label`. With `shortcut`, `/` focuses it on desktop and a hint shows.

### ApStepper

`v-model` number, `min` (0), `max`, and labels for the two buttons ("Use one", "Add one"). Raised buttons in a sunken track; the count is a display numeral. Saves on each press, so pair it with an undo where the change matters.

## Overlays and feedback

### ApDialog

`v-model:open`, `title` (required), `description`. Slots: default (body), `footer` (actions). Built on the native `<dialog>`: focus is trapped, Escape and the backdrop close it, the page behind is inert. A bottom sheet on phones.

- Primary action last in the footer; Cancel before it; a destructive action far left with `mr-auto`.
- For a form, give the `<form>` an `id` and the submit button `type="submit" form="<id>"`, so Enter submits.
- Handing off from one dialog to another (Edit, then Remove) is safe: closing the first doesn't close the second.

### ApToaster and useToast

Mount `<ApToaster />` once. `useToast().show(message, { action?, tone?, duration? })`. One optional action, usually Undo or View. Toasts with an action stay 6 seconds, others 3.5; at most three show at once. Confirm what happened and name the thing: "Removed 9V batteries from Drawer B".

## Layout and navigation

See [Layout](layout.md) for how these fit together.

| Component | What |
|---|---|
| `ApShell` | The frame. Slots: `sidebar` (desktop only), default, `bottom` (tab bar or dock). |
| `ApContainer` | Page width and gutters (20 / 32 / 48px, max 1200px). |
| `ApPageHead` | Large title (`title`), slots `back` (phones only), `eyebrow`, `meta`, `actions`. |
| `ApSection` | A titled section. `linkLabel` + `linkTo` for "See all", or the `aside` slot. `as="h3"` when nested. |
| `ApSplit` | List beside a sticky detail pane (`pane` slot) at 960px and up; the pane hides below that. |
| `ApSidebar` | Desktop navigation. Slots: `brand`, default, `footer`. |
| `ApBrand` | App name beside the arched bottle mark. |
| `ApNavGroup` / `ApNavItem` | Labelled groups of sidebar links. `count` shows at the right; `alert` turns it oxblood. Active state follows the router unless you pass `active`. |
| `ApTabBar` / `ApTab` | Floating phone navigation: four `ApTab`s around an `ApFab`. Hidden at 960px and up. |
| `ApDock` | Bottom action dock on phones, casting a shadow up over content. `mobileOnly` (default true). |

## Composables

| Composable | Returns |
|---|---|
| `useTheme()` | `{ theme, toggle }`. Sets `data-theme` on `<html>` and remembers it. |
| `useToast()` | `{ toasts, show, dismiss }` |
| `useIsDesktop()` | A ref, true at 960px and up |
| `useMediaQuery(query)` | A ref for any media query |

## Adding a component

1. Build it in `packages/ui/src/components` from the tokens (`bg-surface-1`, `shadow-raised`, `type-meta`). No raw hex values, and no colors outside the palette.
2. Export it from `packages/ui/src/index.ts`.
3. Add an example in `apps/design-docs/src/examples/` and an entry in `apps/design-docs/src/catalog.ts`.
4. Document it here: what it's for, its props, its rules.
