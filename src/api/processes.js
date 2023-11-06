import { PATH } from "./path"
import { fetchWithAuth } from "./utils"

export const getProcesses = async () => {
  const response = await fetchWithAuth(`${PATH.PROCESSES}`)

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  const result = await response.json()

  return result;
}