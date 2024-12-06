/**
 * @typedef {Object} AggregateTableDataDTO
 * @property {string} id
 * @property {string} aggregation_name
 * @property {string} table_name
 * @property {string} last_data_update
 * @property {string} last_schema_update
 * @property {string} schedule
 * @property {string} last_event
 * @property {string} current_status
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
     * @param {string} data.currentStatus
     */
    constructor({
        id = '',
        name = '',
        tableName = '',
        lastSchemaUpdate,
        lastDataUpdate,
        schedule = '',
        lastEvent = '',
        currentStatus = '',
        lastModifiedBy = '',
        createdBy = '',
        isGenerated = false,
    }) {
        this.id = id;
        this.name = name;
        this.tableName = tableName;
        this.lastSchemaUpdate = lastSchemaUpdate;
        this.lastDataUpdate = lastDataUpdate;
        this.schedule = schedule;
        this.lastEvent = lastEvent;
        this.currentStatus = currentStatus;
        this.lastModifiedBy = lastModifiedBy;
        this.createdBy = createdBy;
        this.isGenerated = isGenerated;
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
            currentStatus: item.current_status,
            lastModifiedBy: item.last_modified_by,
            createdBy: item.created_by,
            isGenerated: item.is_generated_nifi_process === 'f' ? false : true,
        }

        return new AggregateTableData(data)
    })
}
