/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Base URL for the DRF API. Defaults to /api, which Vite proxies to Django in dev. */
  readonly VITE_API_URL?: string
  /** "api" reads the backend; anything else (the default) uses sample data. */
  readonly VITE_DATA_SOURCE?: 'api' | 'mock'
}
