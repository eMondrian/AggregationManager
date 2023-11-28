import Keycloak from "keycloak-js";
import getConfig from '@/app.config';


const config = await getConfig();
console.log(config);

const initOptions = {
  url: config.auth.basePath,
  realm: config.auth.realm,
  clientId: config.auth.cliendId,
  onLoad:'login-required'
}

const keycloakInstance = new Keycloak(initOptions);

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const Login = (onAuthenticatedCallback) => {
  keycloakInstance
    .init({ onLoad: initOptions.onLoad })
    .then((authenticated) => {
      authenticated ? onAuthenticatedCallback() : alert("non authenticated");
    })
    .catch((e) => {
      console.dir(e);
      console.log(`keycloak init exception: ${e}`);
    });
};

const UserName = () =>
  keycloakInstance?.tokenParsed?.preferred_username;

const Token = () => keycloakInstance?.token;

const LogOut = () => keycloakInstance.logout();

const updateToken = (successCallback) =>
  keycloakInstance.updateToken(5).then(successCallback).catch(doLogin);

const doLogin = keycloakInstance.login;

const isLoggedIn = () => !!keycloakInstance.token;

export const KeycloakService = {
  CallLogin: Login,
  GetUserName: UserName,
  GetAccesToken: Token,
  CallLogOut: LogOut,
  UpdateToken: updateToken,
  IsLoggedIn: isLoggedIn,
};