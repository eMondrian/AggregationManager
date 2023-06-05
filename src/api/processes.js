import { PATH } from "./path"

export const getProcesses = async () => {
  // return [
  //   {
  //     "name": "GenerateFlowFile",
  //     "id":"59eb0ae8-0188-1000-459b-7b3b4ef7dc1c"
  //   }
  // ]
  const response = await fetch(`${PATH.PROCESSES}`)

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
  }

  const result = await response.json()

  return result;
}