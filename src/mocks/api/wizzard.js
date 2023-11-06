import { wait } from "@/helpers"

export const getTableList = async () => {
  await wait(500)
  const result = [
    {"database":"dpd_sandbox","name":"AM_AggregatedScans25Months"},
    {"database":"dpd_sandbox","name":"AM_AggregatedScans25Months_temp"},
    {"database":"dpd_sandbox","name":"AggregatedScans25Months"},
    {"database":"dpd_sandbox","name":"AggregatedScans25MonthsView"},
    {"database":"dpd_sandbox","name":"BaseParcels"},
    {"database":"dpd_sandbox","name":"ClaimsLastStatus"},
    {"database":"dpd_sandbox","name":"ClearingData"},
    {"database":"dpd_sandbox","name":"DailyRevenueData"},
    {"database":"dpd_sandbox","name":"DeduplicateBaseParcelsView"},
    {"database":"dpd_sandbox","name":"DeduplicateGoldenParcelsView"},
    {"database":"dpd_sandbox","name":"DeduplicateScansView"},
    {"database":"dpd_sandbox","name":"DictAlphaNumericTour"},
    {"database":"dpd_sandbox","name":"DictBuCodeCountry"},
    {"database":"dpd_sandbox","name":"DictBuCodeCountryExt"},
    {"database":"dpd_sandbox","name":"DictBusinessUnit"},
    {"database":"dpd_sandbox","name":"DictContract"},
    {"database":"dpd_sandbox","name":"DictCountryCodes"},
    {"database":"dpd_sandbox","name":"DictCustomerFirstShipmentDate"},
    {"database":"dpd_sandbox","name":"DictCustomers"},
    {"database":"dpd_sandbox","name":"DictDepots"},
    {"database":"dpd_sandbox","name":"DictEnergyConsumption"},
    {"database":"dpd_sandbox","name":"DictExchangeRates"},
    {"database":"dpd_sandbox","name":"DictExternalCustomsCosts"},
    {"database":"dpd_sandbox","name":"DictHardware"},
    {"database":"dpd_sandbox","name":"DictItMaintenanceCosts"},
    {"database":"dpd_sandbox","name":"DictLinehaulRoutes"},
    {"database":"dpd_sandbox","name":"DictPltId"},
    {"database":"dpd_sandbox","name":"DictReasonCodeDescription"},
    {"database":"dpd_sandbox","name":"DictSapCorporateAccounts"},
    {"database":"dpd_sandbox","name":"DictScanCodeDescription"},
    {"database":"dpd_sandbox","name":"DictScanWorkloadWeighting"},
    {"database":"dpd_sandbox","name":"DictSellerCode"},
  ]
  // console.log('$$$ api/wizzard | getTableList', result)
  return result
}

export const getColumnsList = async (tableDesc) => {
  await wait(500)
  const result = [
    {"name":"CdbScanId","position":"1","type":"String"},
    {"name":"CdbParcelId","position":"2","type":"String"},
    {"name":"CdbOrderId","position":"3","type":"String"},
    {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
    {"name":"CdbScanId","position":"1","type":"String"},
    {"name":"CdbParcelId","position":"2","type":"String"},
    {"name":"CdbOrderId","position":"3","type":"String"},
    {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
    {"name":"CdbScanId","position":"1","type":"String"},
    {"name":"CdbParcelId","position":"2","type":"String"},
    {"name":"CdbOrderId","position":"3","type":"String"},
    {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
    {"name":"CdbScanId","position":"1","type":"String"},
    {"name":"CdbParcelId","position":"2","type":"String"},
    {"name":"CdbOrderId","position":"3","type":"String"},
    {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
  ]
  // console.log('$$$ api/wizzard | getColumnsList', result, tableDesc)
  return result
}

export const getQuery = async (data) => {
  await wait(500)
  const result = {
    query: "SELECT TEST FROM TEST"
  }
  // console.log('$$$ api/wizzard | getQuery', result, data)
  return result
}


export const getQueryPerformance = async (query, requestController) => {
  await wait(500)
  const result = {
    rows_count: 123
  }
  // console.log('$$$ api/wizzard | getQuery', result, query, requestController)

  return result
}
