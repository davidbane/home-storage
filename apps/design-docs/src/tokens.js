import tokens from '@home/tokens/tokens.json'

export { tokens }

const colors = new Map(tokens.color.tokens.map((token) => [token.name, token]))

/** A color token's hex in a theme, following {alias} references. */
export function hex(name, theme, depth = 0) {
  const token = colors.get(name)
  if (!token || depth > 16) return undefined
  const value = typeof token.value === 'object' ? (token.value[theme] ?? Object.values(token.value)[0]) : token.value
  const alias = /^\{(.+)\}$/.exec(value)
  return alias ? hex(alias[1], theme, depth + 1) : value.toLowerCase()
}

const lum = (hexColor) => {
  const [red, green, blue] = [1, 3, 5].map((offset) => parseInt(hexColor.slice(offset, offset + 2), 16) / 255).map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}
/** WCAG 2 contrast ratio between two hex colors. */
export function contrast(first, second) {
  if (!first || !second) return 0
  const [hi, lo] = [lum(first), lum(second)].sort((left, right) => right - left)
  return (hi + 0.05) / (lo + 0.05)
}
