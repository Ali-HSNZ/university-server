const { validationResult } = require('express-validator')
const createHttpError = require('http-errors')

const xlsx = require('xlsx')

const createTeacherFileValidationMiddleware = (req, res, next) => {
    try {
        if (!req.file) {
            throw new createHttpError.BadRequest('فایل الزامی می باشد')
        }
        const workBook = xlsx.readFile(req.file?.path)
        const sheetName = workBook.SheetNames[0]

        const data = xlsx.utils.sheet_to_json(workBook.Sheets[sheetName])
    
        // console.log(data)

        // console.log(mapLabelsToValues(data, columns))

        req.body = data
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = createTeacherFileValidationMiddleware
