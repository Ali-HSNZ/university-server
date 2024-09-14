const { unlinkSync } = require('fs')
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

        if (data?.length === 0) throw new createHttpError.BadRequest('داده فایل معتبر نیست')

        req.body = data
        next()
    } catch (error) {
        if (req?.file?.path) unlinkSync(req.file.path)

        next(error)
    }
}
