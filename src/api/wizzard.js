import { PATH } from "./path"

export const getTableList = async () => {
  const response = await fetch(PATH.SOURCE_TABLES, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
  })


  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  return await response.json();
  // return [
  //   {"database":"dpd_sandbox","name":"AM_AggregatedScans25Months"},
  //   {"database":"dpd_sandbox","name":"AM_AggregatedScans25Months_temp"},
  //   {"database":"dpd_sandbox","name":"AggregatedScans25Months"},
  //   {"database":"dpd_sandbox","name":"AggregatedScans25MonthsView"},
  //   {"database":"dpd_sandbox","name":"BaseParcels"},
  //   {"database":"dpd_sandbox","name":"ClaimsLastStatus"},
  //   {"database":"dpd_sandbox","name":"ClearingData"},
  //   {"database":"dpd_sandbox","name":"DailyRevenueData"},
  //   {"database":"dpd_sandbox","name":"DeduplicateBaseParcelsView"},
  //   {"database":"dpd_sandbox","name":"DeduplicateGoldenParcelsView"},
  //   {"database":"dpd_sandbox","name":"DeduplicateScansView"},
  //   {"database":"dpd_sandbox","name":"DictAlphaNumericTour"},
  //   {"database":"dpd_sandbox","name":"DictBuCodeCountry"},
  //   {"database":"dpd_sandbox","name":"DictBuCodeCountryExt"},
  //   {"database":"dpd_sandbox","name":"DictBusinessUnit"},
  //   {"database":"dpd_sandbox","name":"DictContract"},
  //   {"database":"dpd_sandbox","name":"DictCountryCodes"},
  //   {"database":"dpd_sandbox","name":"DictCustomerFirstShipmentDate"},
  //   {"database":"dpd_sandbox","name":"DictCustomers"},
  //   {"database":"dpd_sandbox","name":"DictDepots"},
  //   {"database":"dpd_sandbox","name":"DictEnergyConsumption"},
  //   {"database":"dpd_sandbox","name":"DictExchangeRates"},
  //   {"database":"dpd_sandbox","name":"DictExternalCustomsCosts"},
  //   {"database":"dpd_sandbox","name":"DictHardware"},
  //   {"database":"dpd_sandbox","name":"DictItMaintenanceCosts"},
  //   {"database":"dpd_sandbox","name":"DictLinehaulRoutes"},
  //   {"database":"dpd_sandbox","name":"DictPltId"},
  //   {"database":"dpd_sandbox","name":"DictReasonCodeDescription"},
  //   {"database":"dpd_sandbox","name":"DictSapCorporateAccounts"},
  //   {"database":"dpd_sandbox","name":"DictScanCodeDescription"},
  //   {"database":"dpd_sandbox","name":"DictScanWorkloadWeighting"},
  //   {"database":"dpd_sandbox","name":"DictSellerCode"},
  // ]
}

export const getColumnsList = async (tableDesc) => {
  const response = await fetch(`${PATH.COLUMNS}?database=${tableDesc.database}&table=${tableDesc.name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
  })


  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  return await response.json();
  // return [
  //   {"name":"CdbScanId","position":"1","type":"String"},
  //   {"name":"CdbParcelId","position":"2","type":"String"},
  //   {"name":"CdbOrderId","position":"3","type":"String"},
  //   {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
  //   {"name":"CdbScanId","position":"1","type":"String"},
  //   {"name":"CdbParcelId","position":"2","type":"String"},
  //   {"name":"CdbOrderId","position":"3","type":"String"},
  //   {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
  //   {"name":"CdbScanId","position":"1","type":"String"},
  //   {"name":"CdbParcelId","position":"2","type":"String"},
  //   {"name":"CdbOrderId","position":"3","type":"String"},
  //   {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
  //   {"name":"CdbScanId","position":"1","type":"String"},
  //   {"name":"CdbParcelId","position":"2","type":"String"},
  //   {"name":"CdbOrderId","position":"3","type":"String"},
  //   {"name":"CdbMemDateTime","position":"4","type":"DateTime"},
  // ]
}

export const getQuery = async (data) => {
  const response = await fetch(PATH.WIZARD_QUERY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })

  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  return await response.json();
  // return {
  //   query: "SELECT TEST FROM TEST"
  // }
}