import config from '@/app.config.js';

const BASE_PATH = config.baseURL;

export const PATH = {
    BASE: BASE_PATH,
    PROCESSES: `${BASE_PATH}/v1/nifi-processes`,
    AGGREGATION_TABLE: `${BASE_PATH}/aggregation_table`,
    AGGREGATION: `${BASE_PATH}/v1/aggregations`,
    EVENT: `${BASE_PATH}/v1/events`,

    SOURCE_TABLES: `${BASE_PATH}/v1/source-tables`,
    COLUMNS: `${BASE_PATH}/v1/source-table-columns`,
    WIZARD_QUERY: `${BASE_PATH}/v1/wizard-query`
}
