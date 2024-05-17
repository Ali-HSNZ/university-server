const getDayByCode = (code) => {
    let day = ''

    switch (Number(code)) {
        case 0:
            day = 'شنبه'
            break
        case 1:
            day = 'یک‌شنبه'
            break
        case 2:
            day = 'دوشنبه'
            break
        case 3:
            day = 'سه‌شنبه'
            break
        case 4:
            day = 'چهارشنبه'
            break
    }
    return day
}

module.exports = getDayByCode
