import sample from 'lodash/sample'
import shuffle from 'lodash/shuffle'

let id = 0
// NOTE: use schemas from dataSchema.js
// NOTE: the value under key in schema can be false value or Array of possible values
//       in case if it's an array then random value will be taken        
export const generateData = (schema) => {
    return Object.keys(schema).reduce((acc, key) => {
        const initialValues = schema[key]

        if (initialValues) {
            acc[key] = sample(initialValues)
        } else {
            acc[key] = `${key}--${id}`
            id++
        }

        return acc
    }, {})
}

export const generateArrayData = (schema, length = 50) => {
    const result =  [...Array(length)].map(() => {
        return generateData(schema)
    })
    return shuffle(result)
}

export const generateRandomDate = (from, to) => {
    return new Date(
      from.getTime() +
        Math.random() * (to.getTime() - from.getTime()),
    );
}
