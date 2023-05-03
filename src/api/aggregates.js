import { AggregateTableData } from "./models/AggregateTableData"
import { PATH } from "./path"

export const getAggregatesTableData = async () => {
    const response = await fetch(PATH.AGGREGATION)
    const result = await response.json()

    return AggregateTableData.parseFromDTO(result)
}

export const createFromNifiProcess = async ({ name, process }) => {
    const result = await new Promise((res) => {
        setTimeout(() => {
            res({ name, process })
        }, 1000)
    })

    console.log({ name, process })

    return result
}
