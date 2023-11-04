import { PATH } from "./path"

export const getSettings = async () => {
  const response = await fetch(PATH.SETTINGS)

  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  const result = await response.json()

  return result;
}

export const updateSettings = async (data) => {
  const response = await fetch(PATH.SETTINGS, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })

  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }
}

export const getTemplates = async () => {
  const response = await fetch(PATH.TEMPLATES)

  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  const result = await response.json()

  return result;
}