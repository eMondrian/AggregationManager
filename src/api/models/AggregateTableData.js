/**
 * @typedef {Object} AggregateTableDataDTO
 * @property {string} id
 * @property {string} name
 * @property {string} table_name
 * @property {string} last_data_update
 * @property {string} last_schema_update
 * @property {string} schedule
 * @property {string} last_event
 */

export class AggregateTableData {
    /**
     * @param {Object} data
     * @param {string} data.id
     * @param {string} data.name
     * @param {string} data.tableName
     * @param {Date} data.lastSchemaUpdate
     * @param {Date} data.lastDataUpdate
     * @param {string} data.schedule
     * @param {string} data.lastEvent
     */
    constructor({
        id = '',
        name = '',
        tableName = '',
        lastSchemaUpdate,
        lastDataUpdate,
        schedule = '',
        lastEvent = '',
    }) {
        this.id = id;
        this.name = name;
        this.tableName = tableName;
        this.lastSchemaUpdate = lastSchemaUpdate;
        this.lastDataUpdate = lastDataUpdate;
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
            name: item.aggregation_name,
            tableName: item.table_name,
            lastSchemaUpdate: new Date(item.last_schema_update),
            lastDataUpdate: new Date(item.last_data_update),
            schedule: item.schedule,
            lastEvent: item.last_event,
        }

        return new AggregateTableData(data)
    })
}
