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
        name = '',
        tableName = '',
        lastSchemaUpdate = '',
        lastDataUpdate = '',
        rowsCount = '',
        nextDataUpdate = '',
    }) {
        this.id = id;
        this.name = name;
        this.tableName = tableName;
        this.lastSchemaUpdate = new Date(lastSchemaUpdate).toLocaleString();
        this.lastDataUpdate = new Date(lastDataUpdate).toLocaleString();
        this.rowsCount = rowsCount;
        this.nextDataUpdate = new Date(nextDataUpdate).toLocaleString();
    }

    /**
     * @param {AggregateTableDataDTO[]} items 
     * @returns {AggregateTableData[]}
     */
    static parseFromDTO = (items) => items.map((item) => {
        const data = {
            id: item.id,
            name: item.name,
            tableName: item.table_name,
            lastSchemaUpdate: item.last_schema_update,
            lastDataUpdate: item.last_data_update,
            rowsCount: item.rows_count,
            nextDataUpdate: item.next_data_update,
        }

        return new AggregateTableData(data)
    })
}