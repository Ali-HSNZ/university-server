const getDayCode = (day) => {
    let result = ''

    switch (day) {
        case 'شنبه':
            result = 0
            break
        case 'یک‌شنبه':
            result = 1
            break
        case 'دوشنبه':
            result = 2
            break
        case 'سه‌شنبه':
            result = 3
            break
        case 'چهارشنبه':
            result = 4
            break
    }
    return result.toString()
}

module.exports = getDayCode
