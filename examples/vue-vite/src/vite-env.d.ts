/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOX_VUE_DEV_TOKEN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
