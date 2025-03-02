/**
 * @typedef {Object} AggregationHistoryItemDataDTO
 * @property {string} aggregation_id
 * @property {string} aggregation_name
 * @property {string} table_name
 * @property {string} query
 * @property {string} scheduling_period
 * @property {string} scheduling_strategy
 * @property {string} start_nifi_process_id
 */

export class AggregationHistoryItemData {
    /**
     * @param {Object} data
     * @param {string} data.aggregation_id
     * @param {string} data.aggregation_name
     * @param {string} data.table_name
     * @param {string} data.query
     * @param {string} data.scheduling_period
     * @param {string} data.scheduling_strategy
     * @param {string} data.start_nifi_process_id
     */
    constructor({
        aggregation_id = '',
        aggregation_name = '',
        table_name = '',
        query = '',
        scheduling_period = '',
        scheduling_strategy = '',
        start_nifi_process_id = '',
    }) {
        this.aggregation_id = aggregation_id;
        this.aggregation_name = aggregation_name;
        this.table_name = table_name;
        this.query = query;
        this.scheduling_period = scheduling_period;
        this.scheduling_strategy = scheduling_strategy;
        this.start_nifi_process_id = start_nifi_process_id;
    }

/**
 * @param {AggregationHistoryItemDataDTO} item
 * @returns {AggregationHistoryItemData}
 */
static parseFromDTO = (item) => {
    const data = {
        aggregation_id: item.aggregation_id,
        aggregation_name: item.aggregation_name,
        table_name: item.table_name,
        query: item.query,
        scheduling_period: item.scheduling_period,
        scheduling_strategy: item.scheduling_strategy,
        start_nifi_process_id: item.start_nifi_process_id,
    };

    return new AggregationHistoryItemData(data);
}

}
