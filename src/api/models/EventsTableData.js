/**
 * @typedef {Object} EventsTableDataDTO
 * @property {string} id
 * @property {string} event_type
 * @property {string} date_time
 * @property {string} event_message
 * @property {string} aggregation_name
 */

export class EventsTableData {
    /**
     * @param {Object} data
     * @param {string} data.id
     * @param {string} data.eventType
     * @param {Date} data.dateTime
     * @param {string} data.eventMessage
     * @param {string} data.aggregationName
     */
    constructor({
        id = '',
        eventType = '',
        dateTime,
        eventMessage = '',
        aggregationName = '',
    }) {
        this.id = id;
        this.eventType = eventType;
        this.dateTime = dateTime;
        this.eventMessage = eventMessage;
        this.aggregationName = aggregationName;
    }

    /**
     * @param {EventsTableDataDTO[]} items 
     * @returns {EventsTableData[]}
     */
    static parseFromDTO = (items) => items.map((item) => {
        const data = {
            id: item.id,
            eventType: item.event_type,
            dateTime: new Date(item.date_time),
            eventMessage: item.event_message,
            aggregationName: item.aggregation_name,
        }

        return new EventsTableData(data)
    })
}
