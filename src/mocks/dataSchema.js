import { generateRandomDate } from './helpers'

export const aggregatesTableDataSchema = () => ({
    id: null,
    aggregation_name: null,
    table_name: null,
    last_data_update: [
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
    ],
    last_schema_update: [
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
    ],
    schedule: null,
    last_event: null,
    current_status: null,
})

export const eventsTableDataSchema = () => ({
    id: null,
    event_type: null,
    date_time: [
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
        generateRandomDate(new Date(2000, 0, 1), new Date()).toISOString(),
    ],
    event_message: null,
    aggregation_name: null,
})