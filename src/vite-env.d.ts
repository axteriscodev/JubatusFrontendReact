/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_EVENT_ENDPOINT: string;
  readonly VITE_WIP_MODE: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
