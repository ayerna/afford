/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_NOTIFICATION_API_BASE?: string;
  readonly VITE_NOTIFICATION_API_TOKEN?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
