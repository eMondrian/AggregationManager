export { PATH } from './path'
// NOTE: change to '@/mocks/api/..' for switching to a mocked api
export { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation, getRunStatus, setRunStatus, resetCommand, getAggregationHistoryItem } from '@/api/aggregates'
export { getEventsTableData } from '@/api/events'
export { getProcesses } from '@/api/processes'
export { getColumnsList, getQuery, getTableList, getQueryPerformance } from '@/api/wizzard'
export { getSettings, getTemplates, updateSettings } from '@/api/settings'
export { getUsersTableData, addUser, getUser, updateUser, removeUser } from '@/api/users'

// export { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation, getRunStatus, setRunStatus, resetCommand, getAggregationHistoryItem } from '@/mocks/api/aggregates'
// export { getEventsTableData } from '@/mocks/api/events'
// export { getProcesses } from '@/mocks/api/processes'
// export { getColumnsList, getQuery, getTableList, getQueryPerformance } from '@/mocks/api/wizzard'
// export { getSettings, getTemplates, updateSettings } from '@/mocks/api/settings'
// export { getUsersTableData, addUser, getUser, updateUser, removeUser } from '@/api/users'