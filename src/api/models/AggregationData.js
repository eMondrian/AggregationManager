/**
 * @typedef {Object} AggregationDataDTO
 * @property {string} id
 * @property {string} aggregation_name
 * @property {string} table_name
 * @property {string} query
 * @property {string} scheduling_period
 * @property {string} scheduling_strategy
 * @property {string} is_generated_nifi_process
 * @property {string} start_nifi_process_id
 * @property {Object[]} history_items
 * @property {string} history_items[].id
 * @property {string} history_items[].last_modified_by
 * @property {string} history_items[].last_schema_update
 */

export class AggregationData {
    /**
     * @param {Object} data
     * @param {string} data.id
     * @param {string} data.aggregation_name
     * @param {string} data.table_name
     * @param {string} data.query
     * @param {string} data.scheduling_period
     * @param {string} data.scheduling_strategy
     * @param {string} data.is_generated_nifi_process
     * @param {string} data.start_nifi_process_id
     * @param {Object[]} data.history_items
     */
    constructor({
        id = '',
        aggregation_name = '',
        table_name = '',
        query = '',
        scheduling_period = '',
        scheduling_strategy = '',
        is_generated_nifi_process = '',
        start_nifi_process_id = '',
        history_items = []
    }) {
        this.id = id;
        this.aggregation_name = aggregation_name;
        this.table_name = table_name;
        this.query = query;
        this.scheduling_period = scheduling_period;
        this.scheduling_strategy = scheduling_strategy;
        this.is_generated_nifi_process = is_generated_nifi_process;
        this.start_nifi_process_id = start_nifi_process_id;
        this.history_items = history_items;
    }

/**
 * @param {AggregationDataDTO} item
 * @returns {AggregationData}
 */
static parseFromDTO = (item) => {
    const data = {
        id: item.id,
        aggregation_name: item.aggregation_name,
        table_name: item.table_name,
        query: item.query,
        scheduling_period: item.scheduling_period,
        scheduling_strategy: item.scheduling_strategy,
        is_generated_nifi_process: item.is_generated_nifi_process,
        start_nifi_process_id: item.start_nifi_process_id,
        history_items: item.history_items.map(h => ({
            id: h.id,
            last_modified_by: h.last_modified_by,
            last_schema_update: new Date(h.last_schema_update),
        })),
    };

    return new AggregationData(data);
}

}
