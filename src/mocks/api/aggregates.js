import { wait } from "@/helpers"
import { AggregateTableData } from "@/api/models/AggregateTableData"
import { aggregatesTableDataSchema } from '../dataSchema'
import { generateArrayData } from "../helpers"

export const getAggregatesTableData = async () => {
    await wait(500)
    const generatedData = generateArrayData(aggregatesTableDataSchema())
    const result = AggregateTableData.parseFromDTO(generatedData)
    console.log('$$$ api/aggregates | getAggregatesTableData', result)
    return result
}

export const addAgregation = async (data) => {
    await wait(500)
    const result = { ...data }
    console.log('$$$ api/aggregates | addAgregation', result)
    return result
}

export const getAggregation = async (id) => {
    await wait(500)
    const result = { id }
    console.log('$$$ api/aggregates | getAggregation', result)
    return result
}

export const updateAggregation = async (data) => {
    await wait(500)
    const result = { ...data }
    console.log('$$$ api/aggregates | updateAggregation', result)
    return result
}

export const removeAgregation = async (id) => {
    await wait(500)
    const result = { id }
    console.log('$$$ api/aggregates | removeAgregation', result)
    return result
}

export const getRunStatus = async (id) => {
    await wait(500)
    const result = { id, state: "RUNNING" }
    console.log('$$$ api/aggregates | getRunStatus', result)
    return result
}

export const setRunStatus = async (id, state) => {
    await wait(500)
    const result = { id, state }
    console.log('$$$ api/aggregates | setRunStatus', result)
    return result
}


export const resetCommand = async (id) => {
    await wait(500)
    console.log('$$$ api/aggregates | resetCommand', id)
    return;
}