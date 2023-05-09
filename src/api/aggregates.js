import { AggregateTableData } from "./models/AggregateTableData"
import { PATH } from "./path"

export const getAggregatesTableData = async () => {
    const response = await fetch(PATH.AGGREGATION)
    const result = await response.json()


    return AggregateTableData.parseFromDTO(result)
}

export const addAgregation = async (data) => {
    await fetch(PATH.AGGREGATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
}

export const removeAgregation = async (id) => {
    await fetch(`${PATH.AGGREGATION}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
})
}

export const createWithWizzard = async (data) => {
    const result = await new Promise((res) => {
        setTimeout(() => {
            res(data)
        }, 1000)
    })

    console.log('createWithWizzard: ', data)

    return result
}

export const createFromNifiProcess = async (data) => {
    const result = await new Promise((res) => {
        setTimeout(() => {
            res(data)
        }, 1000)
    })

    console.log('createFromNifiProcess: ', data)

    return result
}

export const createAggregation = async (data) => {
    const result = await new Promise((res) => {
        setTimeout(() => {
            res(data)
        }, 1000)
    })

    console.log('createAggregation: ', data)

    return result
}
