export const generateTableRow = (keys) => (id) => {
    return keys.reduce((acc, key) => {
        acc[key] = `${key}-${id}`

        return acc
    }, {})
}

function shuffle(array) {
    const result = [...array]

    result.sort(() => Math.random() - 0.5);

    return result
}

export const generateTableData = (columnNames, rowsCount = 10) => {
    const array = [...Array(rowsCount)].map((_, i) => i)
    const shuffledArray = shuffle(array)
    const generateRow = generateTableRow(columnNames)
    return shuffledArray.map((id) => generateRow(id))
}
