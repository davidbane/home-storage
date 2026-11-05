# Foundations

Exact values for everything below are in the [token reference](tokens.md). This page is about how to use them.

## Themes

| Theme | Use | Feel |
|---|---|---|
| `night` (default) | The identity | Near-black green ground, bone text |
| `day` | Daylight, and anything printed | Soft sage ground, green-black text |

Set it with `data-theme` on `<html>`. `useTheme()` does that and remembers the choice per browser. `bottle`, `on-bottle` and `brass-on-bottle` are identical in both themes, so the feature card looks the same everywhere. Printed matter (labels) always uses day: put `data-theme="day"` on the printed region.

## Color roles

| Role | Fill (with its text) | Text on a surface | Tint behind text | Used for |
|---|---|---|---|---|
| Action | `sapphire` + `on-sapphire` | `sapphire-ink` | `sapphire-tint` | Primary buttons, add button, active tab, selected tile and row, links |
| Ornament | none | `brass` | `brass-tint` | Bin-tag hairlines, tile hover edge |
| Danger | `oxblood` + `on-sapphire` | `oxblood-ink` | `oxblood-tint` | Remove buttons, Low chip, errors |
| Stocked | none | `verdigris-ink` | `verdigris-tint` | Stocked chip, confirmations |
| Feature | `bottle` | `on-bottle`, `brass-on-bottle` | none | One summary card per screen |
| Neutral | `surface-0/1/2` | `ink`, `ink-muted` | none | Everything else |

Rules:

- **If it's blue, it's tappable.** Never use sapphire for decoration.
- **Text on a tint uses the matching `*-ink`**, never plain `ink`.
- **Never lighten `bottle`.** Its gradient only darkens: lightening drops `brass-on-bottle` under 4.5:1.
- **Color is never the only signal.** Status chips always show their word.
- The palette replaces Tailwind's. `bg-red-500` doesn't exist here, on purpose.

## Typography

| Style | Face | Where |
|---|---|---|
| `type-display-2xl` (60px) | EB Garamond 600 | Desktop screen titles (`md:` and up) |
| `type-display-xl` (44px) | EB Garamond 600 | Phone screen titles |
| `type-display-lg` (30px) | EB Garamond 600 | Section heroes |
| `type-title` (22px) | EB Garamond 600 | Section headings, dialog titles |
| `type-numeral` (32px) | Inter 500 | Counts on tiles and the stepper. Set in Inter so counts line up with the interface |
| `type-body` / `type-body-strong` (15px) | Inter 400 / 500 | Running text, item names, values |
| `type-meta` (13px) | Inter 400 | Paths, timestamps, secondary lines |
| `type-caption` (12px) | Inter 500 | Chips, tab labels. Sentence case, no tracking |
| `type-code` (12px) | JetBrains Mono | Bin codes |

Never set EB Garamond below 20px or use it for item names in lists. Two weights per face, no more. Fonts are self-hosted through `@keep/ui/fonts`.

## Spacing

A 4px scale that matches Tailwind's: `p-4` is 16px. Phone gutters are `space-5` (20px), desktop `space-8`, wide desktop `space-12`. Related things sit 8–12px apart, sections 24–40px.

## Radius

| Token | Use |
|---|---|
| `rounded-sm` (6px) | Bin tags, keyboard hints |
| `rounded-md` (12px) | Buttons, inputs, list groups |
| `rounded-lg` (20px) | Cards, sheets, the feature card |
| `rounded-pill` | Chips, steppers, tab bar, icon buttons |

## Depth

Lit from above, three levels:

| Level | Tokens | What |
|---|---|---|
| Sunken | `shadow-sunken` on `surface-0` | Inputs, the search field, the stepper track: things you type into or adjust |
| Raised | `shadow-raised`, hover `shadow-raised-hover` with a 2px lift, plus the `sheen` utility | Cards, list groups, tiles, panels |
| Floating | `shadow-float`, `shadow-dock`, `shadow-sheet` | Tab bar, bottom action docks, dialogs |

Sapphire fills add `shadow-glow` and `sheen-strong`, so the one action on screen reads as lit. Gradients stay within a few percent of white. Motion is 150ms and turns off under `prefers-reduced-motion`.

## Ornament budget

Two signature moves, nothing else: the **brass bin tag** and the **EB Garamond titles**. No filigree, textures, drop caps or decorative borders. If something new feels like it needs ornament, it probably needs better hierarchy instead.

## Icons

[Tabler](https://tabler.io/icons) outline icons via `@tabler/icons-vue`, `stroke="1.5"` (1.75 for small plus/minus), 18–22px. Color: `ink` or `ink-muted`; `sapphire-ink` when active. Icon-only buttons always have a label (`ApIconButton`'s `label` prop). No filled icons, no emoji.

## Accessibility

- Every text pair in the token reference passes 4.5:1 in both themes.
- Touch targets are 44px or larger at every width; desktop doesn't get smaller controls.
- Focus is a 2px `focus` ring, offset 2px, never removed.
- Dialogs use the native `<dialog>`: focus is trapped, Escape closes, the page behind is inert.
- Real elements only: `<button>`, `<a href>`, `<input>` with a `<label>`.
