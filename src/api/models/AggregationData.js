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
 * @property {Object[]} history
 * @property {string} history[].id
 * @property {string} history[].user
 * @property {string} history[].date
 * @property {Object} history[].state
 * @property {string} history[].state.id
 * @property {string} history[].state.aggregation_name
 * @property {string} history[].state.table_name
 * @property {string} history[].state.query
 * @property {string} history[].state.scheduling_period
 * @property {string} history[].state.scheduling_strategy
 * @property {string} history[].state.is_generated_nifi_process
 * @property {string} history[].state.start_nifi_process_id
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
     * @param {Object[]} data.history
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
        history = []
    }) {
        this.id = id;
        this.aggregation_name = aggregation_name;
        this.table_name = table_name;
        this.query = query;
        this.scheduling_period = scheduling_period;
        this.scheduling_strategy = scheduling_strategy;
        this.is_generated_nifi_process = is_generated_nifi_process;
        this.start_nifi_process_id = start_nifi_process_id;
        this.history = history;
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
        history: item.history.map(h => ({
            id: h.id,
            user: h.user,
            date: new Date(h.date),
            state: h.state,
        })),
    };

    return new AggregationData(data);
}

}
