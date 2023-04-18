import { AggregateTableData } from "./models/AggregateTableData"
import { PATH } from "./path"

export const getAggregatesTableData = async () => {
    const response = await fetch(PATH.AGGREGATION)
    const result = await response.json()

    return AggregateTableData.parseFromDTO(result)
}