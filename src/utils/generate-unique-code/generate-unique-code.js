const generateUniqueCode = (length = 8) => {
    var code = ''

    // Generate 8 unique digits
    var digits = []
    for (var i = 0; i < length; i++) {
        var digit
        do {
            digit = Math.floor(Math.random() * 10) // Generate a random digit (0-9)
        } while (digits.includes(digit)) // Check if the digit is already in the code
        digits.push(digit)
    }

    // Convert the array of digits to a string
    code = digits.join('')

    return code
}
module.exports = generateUniqueCode
