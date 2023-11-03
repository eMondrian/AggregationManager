import { wait } from "@/helpers"

export const getSettings = async () => {
  await wait(500)
  const result = {"default_template_name":"Template6","default_template_id":"b001fbf8-8883-416e-89d6-27b235d12eec"};
  console.log('$$$ api/settings | getSettings', result)
  
  return result;
}

export const updateSettings = async (data) => {
  await wait(500)
  console.log('$$$ api/settings | updateSettings', result, data)
  
}

export const getTemplates = async () => {
  await wait(500)
  const result = [{"name":"ClaimOriginalTemplate","id":"5cdae40d-e9a9-4376-ac4a-ff54b6a146fc"},{"name":"Template6","id":"b001fbf8-8883-416e-89d6-27b235d12eec"}];
  console.log('$$$ api/settings | getTemplates', result)

  return result;
}