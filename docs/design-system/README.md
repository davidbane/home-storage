# Apothecary design system

A dark, modern-gothic look for the home apps: bottle green and bone, a thread of brass, and one jewel-toned sapphire for everything you can press. Built first for the storage catalog, meant to be reskinned for future home apps.

- **Live docs:** `yarn docs` runs every component, both themes and all tokens at http://localhost:5174
- **[Foundations](foundations.md):** color roles, type, depth, ornament, icons
- **[Layout](layout.md):** breakpoints, navigation and page patterns
- **[Components](components.md):** what each component is for, its props and rules
- **[Token reference](tokens.md):** every token with values per theme and contrast ratios (generated)

## Where things live

| Package | What |
|---|---|
| `packages/apothecary-tokens` (`@keep/apothecary-tokens`) | `src/tokens.json` is the source of truth. `yarn tokens` compiles it to CSS variables and a Tailwind v4 theme, and regenerates `tokens.md`. |
| `packages/ui` (`@keep/ui`) | Vue 3 components, composables (`useTheme`, `useToast`, `useIsDesktop`) and base styles. |
| `apps/design-docs` | The live docs app. Examples there are the code shown on each page. |

## Principles

1. **Gothic in the voice, modern in the build.** The gothic lives in two places: the palette and the EB Garamond display face. Everything else is contemporary app UI: soft radii, generous space, tonal surfaces, quiet depth.
2. **Display face for headlines only.** EB Garamond for titles and section heads. Item names, paths, counts, quantities and every control are Inter.
3. **Sapphire means "act".** It's the only interactive fill: primary buttons, the add button, the active tab, the selected tile. One primary button per view. Nothing decorative is blue.
4. **Brass is a thread, not a frame.** A hairline on bin tags, a hover edge on tiles, captions on the feature card. Never a button and never a full border on a card.
5. **Status is a fixed vocabulary.** Low and Stocked: same word, color and dot in every home app.
6. **Depth is lit from above.** Sunken for things you type into or adjust, raised for cards and lists, floating for the tab bar, docks and sheets.

## Starting a new home app

1. Add an app under `apps/` with `vue`, `vue-router`, `pinia`, `@keep/ui` (`workspace:*`), Tailwind and the Vite plugins (copy `apps/materia-web/package.json` and trim).
2. Its stylesheet is two lines:

   ```css
   @import "tailwindcss";
   @import "@keep/ui/styles.css";
   ```

3. In `main.js`, `import '@keep/ui/fonts'` once.
4. Wrap the app in `ApShell` with an `ApSidebar` (desktop) and an `ApTabBar` (phones). Mount `ApToaster` once.
5. To give the app its own identity, change only `bottle` (and `on-bottle`) and optionally `brass` in a theme override, check contrast in the token reference, and keep sapphire as the action color so every home app behaves the same.

## Writing

Short, specific, a little dry, like a careful archivist.

- **Sentence case** everywhere: buttons, headings, labels.
- **Name places the way the household does:** "Hall closet", not "Closet 2".
- **Quantities as figures** with ×: "×12". Par as "3 of 4".
- **Buttons are verbs:** Add item, Move, Print labels. Not OK or Submit.
- **Confirmations name the thing:** "Removed 9V batteries from Drawer B", with Undo.
- **Destructive dialogs name what's affected and offer a calm way out:** "Remove 9V batteries?" with "Keep it" and "Remove".
- **Errors say what happened and what to do:** "Drawer B still holds 3 items. Move or remove them first."
- **Empty states invite:** "Start with a room" and an Add button, not "Nothing here."
- **No** "please", "successfully", "simply", exclamation marks or emoji.
