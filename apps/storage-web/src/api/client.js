import axios from 'axios';

/**
 * Shared axios instance for the DRF API.
 *
 * In dev, Vite proxies /api to the Django server (vite.config.js), so the browser
 * sees one origin: session cookies just work and no CORS setup is needed.
 * Django's CSRF protection expects the csrftoken cookie echoed back as X-CSRFToken
 * on unsafe requests; axios does that with these two settings.
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: { Accept: 'application/json' },
});
