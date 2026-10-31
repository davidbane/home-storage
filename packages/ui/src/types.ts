import type { RouteLocationRaw } from 'vue-router'

/** The four fixed statuses. Same word, color and dot in every home app. */
export type Status = 'low' | 'surplus' | 'long' | 'ok'

export const statusLabel: Record<Status, string> = {
  low: 'Low',
  surplus: 'Surplus',
  long: 'Long-term',
  ok: 'Stocked',
}

export type Theme = 'night' | 'parchment'

export interface Crumb {
  label: string
  to?: RouteLocationRaw
}

/** Anything a component can navigate to: a router location or a plain URL. */
export interface LinkTarget {
  to?: RouteLocationRaw
  href?: string
}
