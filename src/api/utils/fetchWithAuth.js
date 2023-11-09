import { KeycloakService } from "@/authorization/KeycloakService"
import config from '@/app.config'
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
const fetchWithAuthFn = async (input, init) => {
    let mergedInit = init

    if (KeycloakService.IsLoggedIn()) {
        await KeycloakService.UpdateToken();
        mergedInit = addAuthHeader(init)
    }

    return await fetch(input, mergedInit)
}

export const fetchWithAuth = config.auth.isKeycloakAuthActive ? fetchWithAuthFn : fetch
