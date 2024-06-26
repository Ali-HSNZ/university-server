const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
    const error = validationResult(req)
    const obj = {}
    error?.errors.forEach((e) => {
        obj[e.path] = e.msg
    })

    if (Object.keys(obj).length > 0) {
        res.status(400).json({
            code: 400,
            errors: obj,
            message: 'خطای اعتبارسنجی',
        })
    } else {
        next()
    }
}
