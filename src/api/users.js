import { PATH } from "./path"
import { fetchWithAuth } from "./utils"

export const getUsersTableData = async () => {
    const response = await fetchWithAuth(PATH.USERS)

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }

    const result = await response.json()

    return result
}

export const addUser = async (data) => {
    const response = await fetchWithAuth(PATH.USERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}

export const getUser = async (id) => {
    const response = await fetchWithAuth(`${PATH.USERS}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
    
    const result = await response.json();
    return result;
}

export const updateUser = async (data) => {
    const response = await fetchWithAuth(`${PATH.USERS}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}

export const removeUser = async (id) => {
    const response = await fetchWithAuth(`${PATH.USERS}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}
