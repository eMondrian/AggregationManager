export const baseURL = import.meta.env.VITE_BE_BASE_PATH

let loadedConfig = null;
const getConfig = async () => {
  if (loadedConfig) {
    return loadedConfig;
  } else {
    const authConfigRequest = await fetch('/auth.config.json')
    const config = await authConfigRequest.json();
    
    loadedConfig = { 
      auth: config,
      baseURL,
    }

    loadedConfig.auth.isKeycloakAuthActive = loadedConfig.auth.isKeycloakAuthActive === 'true';

    return loadedConfig;
  }
};

export default getConfig;