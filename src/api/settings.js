import { PATH } from "./path"

export const getSettings = async () => {
  const response = await fetch(PATH.SETTINGS)

  if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  const result = await response.json()
  // const result = {"default_template_name":"Template6","default_template_id":"b001fbf8-8883-416e-89d6-27b235d12eec"};

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
  // const result = [{"name":"ClaimOriginalTemplate","id":"5cdae40d-e9a9-4376-ac4a-ff54b6a146fc"},{"name":"Template6","id":"b001fbf8-8883-416e-89d6-27b235d12eec"}];

  return result;
}