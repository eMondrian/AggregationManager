import { PATH } from "./path"
import { fetchWithAuth } from "./utils"

export const getProcesses = async () => {
  const response = await fetchWithAuth(`${PATH.PROCESSES}`)

  if (!response.ok) {
    const type = response.headers.get("Content-Type");
    
    if (type.includes('application/json')) {
        const error = new Error();
        const responseJson = await response.json();
        
        error.contentType = 'json';
        error.errorBody = responseJson;
        error.name = `Error! Status: ${responseJson.status}.`

        throw error;
    } else {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}

  const result = await response.json()

  return result;
}