import tokens from '@home/tokens/tokens.json'

export { tokens }

const colors = new Map(tokens.color.tokens.map((t) => [t.name, t]))

/** A color token's hex in a theme, following {alias} references. */
export function hex(name, theme, depth = 0) {
  const t = colors.get(name)
  if (!t || depth > 16) return undefined
  const v = typeof t.value === 'object' ? (t.value[theme] ?? Object.values(t.value)[0]) : t.value
  const alias = /^\{(.+)\}$/.exec(v)
  return alias ? hex(alias[1], theme, depth + 1) : v.toLowerCase()
}

const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
/** WCAG 2 contrast ratio between two hex colors. */
export function contrast(a, b) {
  if (!a || !b) return 0
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
