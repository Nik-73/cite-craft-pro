/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_DAO_CONTRACT_ADDRESS: string
  readonly VITE_TOKEN_CONTRACT_ADDRESS: string
  readonly VITE_TREASURY_CONTRACT_ADDRESS: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_CHAIN_NAME?: string
  readonly VITE_RPC_URL?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_DESCRIPTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
