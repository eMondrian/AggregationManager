import { PATH } from "./path"
import { fetchWithAuth } from "./utils"

export const getSettings = async () => {
  const response = await fetchWithAuth(PATH.SETTINGS)
  
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

export const updateSettings = async (data) => {
  const response = await fetchWithAuth(PATH.SETTINGS, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })

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
}

export const getTemplates = async () => {
  const response = await fetchWithAuth(PATH.TEMPLATES)

  
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