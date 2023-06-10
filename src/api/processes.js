import { PATH } from "./path"

export const getProcesses = async () => {
  const response = await fetch(`${PATH.PROCESSES}`)

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  const result = await response.json()

  return result;
}