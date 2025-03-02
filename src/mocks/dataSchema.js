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

export const usersTableDataSchema = () => ({
    id: null,
    user_name: null,
    is_admin: [true, false],
    is_power_user: [true, false],
})

export const agregationDataSchema = ({id}) => ({
    id: [id],
    table_name: null,
    aggregation_name: null,
    is_generated_nifi_process: null,
    start_nifi_process_id: [null],
    query: null,
    scheduling_period: null,
    scheduling_strategy: ['TIMER_DRIVEN', 'CRON_DRIVEN'],
    history_items: [
        [{
            id: 'test-id-1',
            last_modified_by: 'test-user-1',
            last_schema_update: new Date().toISOString(),
        },
        {
            id: 'test-id-2',
            last_modified_by: 'test-user-2',
            last_schema_update: new Date().toISOString(),
        }
        ]
    ]
})

export const agregationHistoryItemDataSchema = ({id}) => ({
    aggregation_id: [id],
    aggregation_name: null,
    table_name: null,
    query: null,
    scheduling_period: null,
    scheduling_strategy: null,
    start_nifi_process_id: null,
})
