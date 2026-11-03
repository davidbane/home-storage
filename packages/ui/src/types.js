/**
 * The four fixed statuses. Same word, color and dot in every home app.
 *
 * @typedef {'low' | 'surplus' | 'long' | 'ok'} Status
 */

export const statusLabel = {
  low: 'Low',
  surplus: 'Surplus',
  long: 'Long-term',
  ok: 'Stocked',
}

/** @typedef {'night' | 'parchment'} Theme */

/**
 * @typedef {object} Crumb
 * @property {string} label
 * @property {import('vue-router').RouteLocationRaw} [to]
 */
