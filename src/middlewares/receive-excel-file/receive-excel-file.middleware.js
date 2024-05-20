const createHttpError = require('http-errors')

const xlsx = require('xlsx')

module.exports = (req, res, next) => {
    try {
        if (!req.file) {
            throw new createHttpError.BadRequest('فایل الزامی می باشد')
        }
        const workBook = xlsx.readFile(req.file?.path)
        const sheetName = workBook.SheetNames[0]

        const data = xlsx.utils.sheet_to_json(workBook.Sheets[sheetName])

        req.body = data
        next()
    } catch (error) {
        next(error)
    }
}
