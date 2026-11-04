// Compiles src/tokens.json into:
//   dist/tokens.css  raw design tokens as --ap-* custom properties, one block per theme
//   dist/theme.css   a Tailwind v4 theme that maps utilities onto those properties
// Run: yarn tokens (from the repo root)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'));
const out = resolve(root, 'dist');
mkdirSync(out, { recursive: true });

const PREFIX = 'ap';
const themes = tokens.color.themes.map((theme) => theme.id);
const first = themes[0];
const header = `/* ${tokens.name} v${tokens.version}, generated from tokens.json. Do not edit. */\n`;

const ref = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  const alias = /^\{([A-Za-z0-9_.-]+)\}$/.exec(value);
  return alias ? `var(--${PREFIX}-${alias[1]})` : value.toLowerCase().startsWith('#') ? value.toLowerCase() : value;
};
const valueFor = (token, theme) =>
  typeof token.value === 'object' ? ref(token.value[theme] ?? token.value[first]) : ref(token.value);

// ---------- tokens.css ----------
const themed = [...tokens.color.tokens, ...(tokens.shadow?.tokens ?? [])];
const blocks = themes.map((theme, index) => {
  const selector = index === 0 ? `:root,\n[data-theme="${theme}"]` : `[data-theme="${theme}"]`;
  const lines = themed.map((token) => `  --${PREFIX}-${token.name}: ${valueFor(token, theme)};`);
  return `${selector} {\n  color-scheme: ${theme === 'parchment' ? 'light' : 'dark'};\n${lines.join('\n')}\n}`;
});

const flat = [
  ...(tokens.spacing?.tokens ?? []),
  ...(tokens.radius?.tokens ?? []),
  ...(tokens.layout?.tokens ?? []),
];
const fontFamilies = Object.entries(tokens.type.families).map(([family, stack]) => `  --${PREFIX}-font-${family}: ${stack};`);
const staticBlock = `:root {\n${flat.map((token) => `  --${PREFIX}-${token.name}: ${token.value};`).join('\n')}\n${fontFamilies.join('\n')}\n}`;

writeFileSync(resolve(out, 'tokens.css'), `${header}\n${blocks.join('\n\n')}\n\n${staticBlock}\n`);

// ---------- theme.css (Tailwind v4) ----------
const toRem = (value) => (/^\d+(\.\d+)?px$/.test(value) ? `${parseFloat(value) / 16}rem` : value);
const theme = [];
theme.push('  /* Only the system palette: no stray Tailwind colors. */');
theme.push('  --color-*: initial;');
for (const token of tokens.color.tokens) {
  theme.push(`  --color-${token.name}: var(--${PREFIX}-${token.name});`);
}

theme.push('\n  --font-*: initial;');
for (const family of Object.keys(tokens.type.families)) {
  theme.push(`  --font-${family}: var(--${PREFIX}-font-${family});`);
}

theme.push('\n  --radius-*: initial;');
for (const token of tokens.radius.tokens) {
  theme.push(`  --radius-${token.name.replace(/^radius-/, '')}: var(--${PREFIX}-${token.name});`);
}

theme.push('\n  --shadow-*: initial;');
for (const token of tokens.shadow?.tokens ?? []) {
  theme.push(`  --shadow-${token.name.replace(/^shadow-/, '')}: var(--${PREFIX}-${token.name});`);
}

// Breakpoints have to be literal values: media queries can't read custom properties.
const breakpoints = Object.fromEntries((tokens.layout?.tokens ?? []).map((token) => [token.name, token.value]));
theme.push('\n  --breakpoint-*: initial;');
for (const [size, name] of [['sm', 'bp-sm'], ['md', 'bp-md'], ['lg', 'bp-lg']]) {
  if (breakpoints[name]) {
    theme.push(`  --breakpoint-${size}: ${toRem(breakpoints[name])};`);
  }
}

theme.push('\n  --container-page: var(--ap-container-max);');
theme.push('  --spacing-sidebar: var(--ap-sidebar-width);');
theme.push('  --spacing-pane: var(--ap-pane-width);');

// Type styles become one-class utilities: type-body, type-display-xl, ...
const utilities = [];
for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    const family = style.family ?? group.family;
    const declarations = [
      `  font-family: var(--${PREFIX}-font-${family});`,
      `  font-size: ${toRem(style.fontSize)};`,
      `  line-height: ${style.lineHeight};`,
      `  font-weight: ${style.fontWeight};`,
    ];
    if (style.letterSpacing) {
      declarations.push(`  letter-spacing: ${style.letterSpacing};`);
    }
    utilities.push(`/* ${style.usage} */\n@utility type-${style.name} {\n${declarations.join('\n')}\n}`);
  }
}

writeFileSync(
  resolve(out, 'theme.css'),
  `${header}\n@theme inline {\n${theme.join('\n')}\n}\n\n${utilities.join('\n\n')}\n`,
);

console.log(`tokens: ${themed.length} themed, ${flat.length} static, ${utilities.length} type styles → dist/`);
