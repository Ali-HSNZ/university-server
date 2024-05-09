const { validationResult } = require('express-validator')
const createHttpError = require('http-errors')

module.exports = (req, res, next) => {
    const error = validationResult(req)
    const obj = {}
    error?.errors.forEach((e) => {
        obj[e.path] = e.msg
    })

    console.log(obj)

    if (Object.keys(obj).length > 0) {
        res.status(400).json({
            status: 400,
            errors: obj,
            message: 'خطای اعتبارسنجی',
        })
    } else {
        next()
    }
}
