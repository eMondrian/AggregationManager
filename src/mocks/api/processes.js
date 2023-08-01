import { wait } from "@/helpers"

export const getProcesses = async () => {
  await wait(500)
  const result = []
  console.log('$$$ api/aggregates | getAggregatesTableData', result)
  return result
}