import { wait } from "@/helpers"
import { usersTableDataSchema } from '../dataSchema'
import { generateArrayData } from "../helpers"

export const getUsersTableData = async () => {
    await wait(500)
    const result = generateArrayData(usersTableDataSchema(), 10)
    console.log('$$$ api/users | getUsersTableData', result)
    return result
}

export const addUser = async (data) => {
    await wait(500)
    const result = { ...data }
    console.log('$$$ api/users | addUser', result)
    return result
}

export const getUser = async (id) => {
    await wait(500)
    const result = {
        id,
        user_name: 'test_user',
        is_admin: true,
        is_power_user: false,
    }
    console.log('$$$ api/users | getUser', result)
    return result
}

export const updateUser = async (data) => {
    await wait(500)
    const result = { ...data }
    console.log('$$$ api/users | updateUser', result)
    return result
}

export const removeUser = async (id) => {
    await wait(500)
    const result = { id }
    console.log('$$$ api/users | removeUser', result)
    return result
}
