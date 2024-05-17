const getDayCode = (code) => {
    let day = ''

    switch (code) {
        case 'شنبه':
            day = 0
            break
        case 'یک‌شنبه':
            day = 1
            break
        case 'دوشنبه':
            day = 2
            break
        case 'سه‌شنبه':
            day = 3
            break
        case 'چهارشنبه':
            day = 4
            break
    }
    return day.toString()
}

module.exports = getDayCode
