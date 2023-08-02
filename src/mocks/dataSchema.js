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
    event_message: [
        'Pariatur aute irure tempor ad tempor ex. Proident eiusmod mollit dolor velit laborum eu sit dolor eu non dolor et. Dolore fugiat cupidatat id esse tempor. Sunt officia ut officia dolor eu commodo nulla ullamco consequat ullamco aute velit consequat. Lorem enim eu sit do veniam in ut occaecat incididunt occaecat ea sit voluptate id. Lorem labore tempor exercitation adipisicing sunt ipsum reprehenderit sit.'
    ],
    aggregation_name: null,
})
