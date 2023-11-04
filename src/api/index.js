export { PATH } from './path'
// NOTE: change to '@/mocks/api/..' for switching to a mocked api
export { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation, getRunStatus, setRunStatus, resetCommand } from '@/api/aggregates'
export { getEventsTableData } from '@/api/events'
export { getProcesses } from '@/api/processes'
export { getColumnsList, getQuery, getTableList, getQueryPerformance } from '@/api/wizzard'
export { getSettings, getTemplates, updateSettings } from '@/api/settings'
