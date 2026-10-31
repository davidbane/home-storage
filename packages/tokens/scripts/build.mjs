// Compiles src/tokens.json into:
//   dist/tokens.css  raw design tokens as --ap-* custom properties, one block per theme
//   dist/theme.css   a Tailwind v4 theme that maps utilities onto those properties
// Run: pnpm --filter @home/tokens build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'))
const out = resolve(root, 'dist')
mkdirSync(out, { recursive: true })

const P = 'ap'
const themes = tokens.color.themes.map((t) => t.id)
const first = themes[0]
const header = `/* ${tokens.name} v${tokens.version}, generated from tokens.json. Do not edit. */\n`

const ref = (v) => {
  if (typeof v !== 'string') return v
  const alias = /^\{([A-Za-z0-9_.-]+)\}$/.exec(v)
  return alias ? `var(--${P}-${alias[1]})` : v.toLowerCase().startsWith('#') ? v.toLowerCase() : v
}
const valueFor = (tok, theme) =>
  typeof tok.value === 'object' ? ref(tok.value[theme] ?? tok.value[first]) : ref(tok.value)

// ---------- tokens.css ----------
const themed = [...tokens.color.tokens, ...(tokens.shadow?.tokens ?? [])]
const blocks = themes.map((theme, i) => {
  const sel = i === 0 ? `:root,\n[data-theme="${theme}"]` : `[data-theme="${theme}"]`
  const lines = themed.map((t) => `  --${P}-${t.name}: ${valueFor(t, theme)};`)
  return `${sel} {\n  color-scheme: ${theme === 'parchment' ? 'light' : 'dark'};\n${lines.join('\n')}\n}`
})

const flat = [
  ...(tokens.spacing?.tokens ?? []),
  ...(tokens.radius?.tokens ?? []),
  ...(tokens.layout?.tokens ?? []),
]
const fams = Object.entries(tokens.type.families).map(([k, v]) => `  --${P}-font-${k}: ${v};`)
const staticBlock = `:root {\n${flat.map((t) => `  --${P}-${t.name}: ${t.value};`).join('\n')}\n${fams.join('\n')}\n}`

writeFileSync(resolve(out, 'tokens.css'), `${header}\n${blocks.join('\n\n')}\n\n${staticBlock}\n`)

// ---------- theme.css (Tailwind v4) ----------
const px = (v) => (/^\d+(\.\d+)?px$/.test(v) ? `${parseFloat(v) / 16}rem` : v)
const theme = []
theme.push('  /* Only the system palette: no stray Tailwind colors. */')
theme.push('  --color-*: initial;')
for (const t of tokens.color.tokens) theme.push(`  --color-${t.name}: var(--${P}-${t.name});`)

theme.push('\n  --font-*: initial;')
for (const k of Object.keys(tokens.type.families)) theme.push(`  --font-${k}: var(--${P}-font-${k});`)

theme.push('\n  --radius-*: initial;')
for (const t of tokens.radius.tokens) theme.push(`  --radius-${t.name.replace(/^radius-/, '')}: var(--${P}-${t.name});`)

theme.push('\n  --shadow-*: initial;')
for (const t of tokens.shadow?.tokens ?? []) theme.push(`  --shadow-${t.name.replace(/^shadow-/, '')}: var(--${P}-${t.name});`)

// Breakpoints have to be literal values: media queries can't read custom properties.
const bp = Object.fromEntries((tokens.layout?.tokens ?? []).map((t) => [t.name, t.value]))
theme.push('\n  --breakpoint-*: initial;')
for (const [k, name] of [['sm', 'bp-sm'], ['md', 'bp-md'], ['lg', 'bp-lg']]) if (bp[name]) theme.push(`  --breakpoint-${k}: ${px(bp[name])};`)

theme.push('\n  --container-page: var(--ap-container-max);')
theme.push('  --spacing-sidebar: var(--ap-sidebar-width);')
theme.push('  --spacing-pane: var(--ap-pane-width);')

// Type styles become one-class utilities: type-body, type-display-xl, ...
const utilities = []
for (const g of tokens.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family
    const decl = [
      `  font-family: var(--${P}-font-${fam});`,
      `  font-size: ${px(s.fontSize)};`,
      `  line-height: ${s.lineHeight};`,
      `  font-weight: ${s.fontWeight};`,
    ]
    if (s.letterSpacing) decl.push(`  letter-spacing: ${s.letterSpacing};`)
    utilities.push(`/* ${s.usage} */\n@utility type-${s.name} {\n${decl.join('\n')}\n}`)
  }
}

writeFileSync(
  resolve(out, 'theme.css'),
  `${header}\n@theme inline {\n${theme.join('\n')}\n}\n\n${utilities.join('\n\n')}\n`,
)

console.log(`tokens: ${themed.length} themed, ${flat.length} static, ${utilities.length} type styles → dist/`)
