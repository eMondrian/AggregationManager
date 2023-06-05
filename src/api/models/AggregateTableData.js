/**
 * @typedef {Object} AggregateTableDataDTO
 * @property {string} id
 * @property {string} name
 * @property {string} table_name
 * @property {Date} last_schema_update
 * @property {Date} last_data_update
 * @property {number} rows_count
 * @property {Date} next_data_update
 */

export class AggregateTableData {
    constructor({
        id = '',
        lastSchemaUpdate = '',
        schedule = '',
        lastDataUpdate = '',
        lastEvent = '',
        name = '',
        tableName = '',
    }) {
        this.id = id;
        this.name = name;
        this.tableName = tableName;
        this.lastSchemaUpdate = new Date(lastSchemaUpdate).toLocaleString();
        this.lastDataUpdate = new Date(lastDataUpdate).toLocaleString();
        this.schedule = schedule;
        this.lastEvent = lastEvent;
    }

    /**
     * @param {AggregateTableDataDTO[]} items 
     * @returns {AggregateTableData[]}
     */
    static parseFromDTO = (items) => items.map((item) => {
        const data = {
            id: item.id,
            lastSchemaUpdate: new Date(item.last_schema_update),
            schedule: item.schedule,
            lastDataUpdate: new Date(item.last_data_update),
            lastEvent: item.last_event,
            name: item.aggregation_name,
            tableName: item.table_name,
        }

        return new AggregateTableData(data)
    })
}
