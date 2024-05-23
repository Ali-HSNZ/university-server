module.exports = (input) => {
    // Define a mapping of Western digits to Persian digits
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

    // Replace each digit in the input string with the corresponding Persian digit
    return input.replace(/\d/g, (match) => {
        return persianDigits[match]
    })
}
