const BASE_PATH = import.meta.env.VITE_BE_BASE_PATH

export const PATH = {
    BASE: BASE_PATH,
    AGGREGATION: `${BASE_PATH}/aggregationList`,
    PROCESS: `${BASE_PATH}/processList`,
}