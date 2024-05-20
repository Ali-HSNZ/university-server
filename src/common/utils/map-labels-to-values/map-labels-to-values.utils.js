const mapLabelsToValues = (input, columns) => {
    return input.map((item) => {
        const newItem = {}
        for (const key in item) {
            const column = columns.find((col) => col.label === key)
            if (column) {
                newItem[column.value] = item[key]
            }
        }
        return newItem
    })
}
module.exports = mapLabelsToValues
