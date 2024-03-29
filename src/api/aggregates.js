import { AggregateTableData } from "./models/AggregateTableData"
import { PATH } from "./path"

export const getAggregatesTableData = async () => {
    const response = await fetch(PATH.AGGREGATION)

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }

    const result = await response.json()

    return AggregateTableData.parseFromDTO(result)
}

export const addAgregation = async (data) => {
    const response = await fetch(PATH.AGGREGATION, {
        method: "POST",
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

export const getAggregation = async (id) => {
    const response = await fetch(`${PATH.AGGREGATION}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
    
    const result = await response.json();
    return result;
}

export const updateAggregation = async (data) => {
    const response = await fetch(`${PATH.AGGREGATION}/${data.id}`, {
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

export const removeAgregation = async (id) => {
    const response = await fetch(`${PATH.AGGREGATION}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}

export const getRunStatus = async (id) => {
    const response = await fetch(`${PATH.AGGREGATION}/${id}/run-status`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }

    const result = await response.json();
    return result;
}

export const setRunStatus = async (id, state) => {
    const response = await fetch(`${PATH.AGGREGATION}/${id}/run-status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            state: state
        }),
    })

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}


export const resetCommand = async (id) => {
    const response = await fetch(`${PATH.AGGREGATION}/${id}/reset`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error! status: ${response.status}, message: ${responseText}`);
    }
}