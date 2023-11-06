import { KeycloakService } from "../../authorization/KeycloakService"
import { merge } from "lodash";

/**
 * @param { RequestInit } init
 * @returns
 */
const addAuthHeader = (init) => {
    const authInit = {
        headers: {
            Authorization: `Bearer ${KeycloakService.GetAccesToken()}`,
        }
    }

    return merge(init, authInit)
}

/**
 * @param { RequestInfo | URL } input
 * @param { RequestInit } init
 * @returns { Promise<Response> }
 */
export const fetchWithAuth = async (input, init) => {
    let mergedInit = init

    if (KeycloakService.IsLoggedIn()) {
        await KeycloakService.UpdateToken();
        mergedInit = addAuthHeader(init)
    }

    return await fetch(input, mergedInit)
}
