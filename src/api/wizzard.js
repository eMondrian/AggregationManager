import { PATH } from "./path"
import { fetchWithAuth } from "./utils"

export const getTableList = async () => {
  const response = await fetchWithAuth(PATH.SOURCE_TABLES, {
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
}

export const getColumnsList = async (tableDesc) => {
  const response = await fetchWithAuth(`${PATH.COLUMNS}?database=${tableDesc.database}&table=${tableDesc.name}`, {
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
}

export const getQuery = async (data) => {
  const response = await fetchWithAuth(PATH.WIZARD_QUERY, {
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
}

export const getQueryPerformance = async (query, requestController) => {
  const signal = requestController.signal;
  const response = await fetchWithAuth(PATH.QUERY_PERFORMANCE, {
      method: "POST",
      signal: signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
  })

  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  return await response.json();
}
