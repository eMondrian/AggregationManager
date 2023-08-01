import { wait } from "@/helpers"
import { EventsTableData } from "@/api/models/EventsTableData"
import { eventsTableDataSchema } from '../dataSchema'
import { generateArrayData } from "../helpers"

export const getEventsTableData = async () => {
    await wait(500)
    const generatedData = generateArrayData(eventsTableDataSchema())
    const result = EventsTableData.parseFromDTO(generatedData)
    console.log('$$$ api/events | getEventsTableData', result)
    return result
}