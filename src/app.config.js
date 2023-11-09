export const baseURL = import.meta.env.VITE_BE_BASE_PATH
export const isKeycloakAuthActive = import.meta.env.VITE_KEYCLOAK_AUTH
export const authBasePath = import.meta.env.VITE_KEYCLOAK_AUTH_BASE_PATH
export const authRealm = import.meta.env.VITE_KEYCLOAK_AUTH_REALM
export const authClientId = import.meta.env.VITE_KEYCLOAK_AUTH_CLIENT_ID

export default {
  baseURL,
  auth: {
    isKeycloakAuthActive: isKeycloakAuthActive === 'true',  // NOTE: parse to boolean
    basePath: authBasePath,
    realm: authRealm,
    cliendId: authClientId,
  }
}
