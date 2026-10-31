# home-storage

My home apps, starting with the house storage catalog: a Django REST Framework API and a Vue 3 + TypeScript + Tailwind CSS v4 frontend, styled with the **Apothecary** design system (bottle green and bone, a thread of brass, and one jewel-toned sapphire for everything you can press).

## Layout

```
packages/
  tokens/        @home/tokens  design tokens → CSS variables + a Tailwind v4 theme
  ui/            @home/ui      Vue 3 components built on those tokens
apps/
  storage-web/   the storage catalog: Vue 3, Pinia, axios, Vue Router
  design-docs/   live design system docs (yarn docs)
docs/
  design-system/ guidelines: principles, foundations, layout, components, token reference
backend/         Django + DRF API (moved in from davidbane/homeapi, history kept)
```

The packages are Yarn workspaces, so a change to a component shows up in the app on save. When a second home app needs them outside this repo, publish `@home/tokens` and `@home/ui` (GitHub Packages works well) and version them with Changesets.

## Getting started

Requires Node 22+ (`.nvmrc` pins 24, the current LTS) and Yarn 4. The exact Yarn version is pinned in `package.json` (`packageManager`), and Corepack picks it up:

```sh
nvm install       # reads .nvmrc; afterwards `nvm use` in this folder
corepack enable   # once per Node install (Node 25+: npm install -g corepack first)
yarn install
yarn dev          # builds tokens, then runs the storage app at http://localhost:5173
yarn build        # typecheck and build everything
yarn tokens       # rebuild tokens (and docs/design-system/tokens.md) after editing tokens.json
yarn docs         # live design system docs at http://localhost:5174
```

Adding a dependency to one workspace: `yarn workspace storage-web add <pkg>` (or `@home/ui`, `@home/tokens`). Yarn is set to a plain `node_modules` layout in `.yarnrc.yml`.

### Backend

```sh
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver        # or `yarn api` from the root with the venv active
```

Settings expect a local Postgres database named after your user (see `backend/config/settings.py`).

### Frontend ↔ API

In dev, Vite proxies `/api` to `http://localhost:8000`, so the browser sees one origin: Django's session cookie and CSRF token work with no CORS setup. The axios client (`apps/storage-web/src/api/client.ts`) sends the `csrftoken` cookie back as `X-CSRFToken`.

The app reads sample data by default. To use the real API, create `apps/storage-web/.env.local` with:

```sh
VITE_DATA_SOURCE=api
```

`src/api/endpoints.ts` types the DRF responses as they are today, and `src/api/adapt.ts` turns residences, areas, spots and items into the app's location tree. State lives in a Pinia store (`src/stores/house.ts`).

## Design system

The Apothecary design system is documented in [`docs/design-system`](docs/design-system/README.md) (principles, foundations, layout, every component, and a generated token reference with contrast ratios) and live in `apps/design-docs` (`yarn docs`).

## How the styling fits together

1. **`packages/tokens/src/tokens.json`** is the source of truth: colors per theme (`night`, `parchment`), type styles, spacing, radii, shadows and breakpoints. It's the same file the Apothecary design-system page uses.
2. **`yarn tokens`** compiles it into
   - `dist/tokens.css`: raw `--ap-*` custom properties, one block per `[data-theme]`
   - `dist/theme.css`: a Tailwind `@theme` that maps utilities onto those properties, plus `type-*` utilities for each text style.
3. **`@home/ui/styles.css`** imports both, adds base styles and a few system utilities (`rounded-arch-top`, `sheen`, `feature-wash`), and points Tailwind at the component sources.
4. **The app's `style.css`** is two lines: `@import "tailwindcss";` then `@import "@home/ui/styles.css";`.

Because utilities resolve to CSS variables, switching `data-theme` on `<html>` re-themes everything with no rebuild (`useTheme()` handles that and remembers the choice).

### Tailwind vocabulary

The theme **replaces** Tailwind's default palette, radii, shadows, fonts and breakpoints, so only system values exist:

| Kind | Utilities |
|---|---|
| Color | `bg-surface-0/1/2`, `text-ink`, `text-ink-muted`, `bg-sapphire`, `text-sapphire-ink`, `bg-oxblood-tint`, `border-brass`, `bg-bottle`, … |
| Type | `type-display-2xl`, `type-display-xl`, `type-display-lg`, `type-title`, `type-numeral`, `type-body`, `type-body-strong`, `type-meta`, `type-caption`, `type-code` |
| Depth | `shadow-raised`, `shadow-raised-hover`, `shadow-sunken`, `shadow-glow`, `shadow-float`, `shadow-dock`, `shadow-sheet` |
| Radius | `rounded-sm` 6, `rounded-md` 12, `rounded-lg` 20, `rounded-pill`, `rounded-arch-top` |
| Breakpoints | `sm:` 600px, `md:` 960px (desktop: sidebar, split panes), `lg:` 1280px |
| Layout | `max-w-page`, `w-sidebar`, `w-pane` |

Spacing stays Tailwind's 4px scale, which matches the system (`p-5` is `space-5`, 20px).

## Design rules worth remembering

- **Sapphire means "act".** One `variant="primary"` button per view. Brass is ornament only; nothing decorative is blue.
- **Display face for headlines and numbers only.** Item names, paths, quantities and controls are Inter.
- **Arched things are places.** Only `ApLocationTile` gets the arch.
- **Status is a fixed vocabulary:** Low, Surplus, Long-term, Stocked (`Status` type). The app decides which one applies (`status()` in `apps/storage-web/src/api/house.ts`); components only display it.
- **Depth is lit from above:** sunken for inputs, raised for cards and lists, floating for the tab bar and docks.
- **One URL per state at every width.** `/rooms/hall-closet?in=drawer-b&item=9v-batteries` shows a detail pane on desktop and the item screen on a phone.

## Components (`@home/ui`)

Layout: `ApShell`, `ApContainer`, `ApSidebar`, `ApBrand`, `ApNavGroup`, `ApNavItem`, `ApTabBar`, `ApTab`, `ApFab`, `ApDock`, `ApPageHead`, `ApSection`, `ApSplit`, `ApTileGrid`
Content: `ApList`, `ApListRow`, `ApLocationTile`, `ApPanel`, `ApFeature`, `ApStat`, `ApBreadcrumb`, `ApBinTag`, `ApStatusChip`
Controls: `ApButton`, `ApIconButton`, `ApSearchField`, `ApStepper`
Composables: `useTheme()`, `useIsDesktop()`, `useMediaQuery()`

Icons are [Tabler](https://tabler.io/icons) outline icons via `@tabler/icons-vue`, at stroke 1.5.

## Next steps

- [ ] API: add authentication and per-owner query scoping (every viewset is currently open)
- [ ] API: ID fields for writes and a flat spot list in the serializers; `select_related`/`prefetch_related`
- [ ] API: add `par`, storage class, timestamps and a spot code so Low, Surplus, history and bin tags come from real data
- [ ] API: settings from `.env`, Django 5.2 LTS on Python 3.12+
- [ ] Add Reka UI for dialogs, menus, comboboxes and toasts (move item, confirm remove, undo)
- [ ] Add Histoire for a component playground, and Vitest for `ApStepper` and the status rules
- [ ] Add/edit item forms, labels and lists screens
