export const baseURL = import.meta.env.VITE_BE_BASE_PATH
export const authBasePath = import.meta.env.VITE_AUTH_BASE_PATH
export const authRealm = import.meta.env.VITE_AUTH_REALM
export const authClientId = import.meta.env.VITE_AUTH_CLIENT_ID

export default {
  baseURL,
  auth: {
    basePath: authBasePath,
    realm: authRealm,
    cliendId: authClientId,
  }
}
