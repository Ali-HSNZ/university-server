const createHttpError = require('http-errors')
const { generateUniqueCode } = require('../../../common/utils/generate-unique-code')
const { mapLabelsToValues } = require('../../../common/utils/map-labels-to-values')
const { adminCreateTeacherExcelValidator } = require('../teacher/admin.teacher.validation')
const { AdminLessonMessages } = require('./admin.lesson.messages')
const { AdminLessonQueries } = require('./admin.lesson.queries')
const { adminCreateLessonExcelValidator } = require('./admin.lesson.validation')

class AdminLessonService {
    #queries

    constructor() {
        this.#queries = AdminLessonQueries
    }

    async getAllFiles() {
        const result = await this.#queries.getAllFiles()
        return result.recordset
    }
    async create(lessonDTO) {
        const { title, type, theory_unit, practical_unit } = lessonDTO

        let code = generateUniqueCode()
        let isUnique = false

        // check uniq code
        while (!isUnique) {
            code = generateUniqueCode()
            const existingRecord = await this.#queries.isExistLessonByCode(code)
            if (existingRecord.recordset.length === 0) {
                isUnique = true
            }
        }

        return await this.#queries.create({
            title,
            type,
            theory_unit,
            practical_unit,
            code,
        })
    }

    async checkExistLessonByTitle(title) {
        const availableLesson = await this.#queries.isExistLessonByTitle(title)

        if (availableLesson.recordset.length > 0) {
            return { ['title']: AdminLessonMessages.ExistLessonTitle }
        }
        return false
    }

    async deleteFileByFileId(fileId) {
        return await this.#queries.deleteFileByFileId(fileId)
    }

    async createLessonFile(user, fileUrl) {
        const currentDate = new Date()

        const createFileDate =
            currentDate.toLocaleDateString('fa-IR') +
            ' | ' +
            currentDate.toLocaleTimeString('fa-IR')

        await this.#queries.createLessonFile({
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.type,
            section: 'درس',
            file_path: fileUrl,
            is_show: 1,
            date: createFileDate,
            userId: user.userId,
        })
    }

    async bulkCreate(lessonsList, user, fileUrl) {
        const lessonsDTO = this.convertExcelToValidData(lessonsList)

        for (const lesson of lessonsDTO) {
            const isExistLesson = await this.checkExistLessonByTitle(lesson.title)
            if (isExistLesson && isExistLesson['title']) {
                throw new createHttpError.BadRequest('عنوان درس تکراری است')
            }
            await this.create({
                title: lesson.title,
                type: lesson.type,
                theory_unit: lesson.theory_unit,
                practical_unit: lesson.practical_unit,
            })
        }
        await this.createLessonFile(user, fileUrl)
    }

    convertExcelToValidData(data) {
        const columns = [
            { value: 'title', label: 'عنوان' },
            { value: 'type', label: 'نوع درس' },
            { value: 'theory_unit', label: 'واحد تئوری' },
            { value: 'practical_unit', label: 'واحد عملی' },
        ]

        return mapLabelsToValues(data, columns)
    }

    async validateBulkCreateExcelFile(req) {
        const errors = await Promise.all(
            adminCreateLessonExcelValidator.map((validation) => validation.run(req))
        )

        const errorMap = new Map()

        errors.forEach((e) =>
            e.errors.forEach((err) => {
                if (errorMap.has(err.msg)) {
                    const entry = errorMap.get(err.msg)
                    const index = Number(err.path.match(/\d+/)[0]) + 1
                    entry.path += ` , ${index}`
                } else {
                    const index = Number(err.path.match(/\d+/)[0]) + 1
                    errorMap.set(err.msg, {
                        message: err.msg,
                        path: `ردیف ${Number(index)}`,
                    })
                }
            })
        )

        const validationErrors = Array.from(errorMap.values()).filter(
            (err) => err.message !== 'Invalid value'
        )
        return validationErrors
    }
    async deleteLessonById(code) {
        const result = await this.#queries.getLessonTitleByLessonCode(code)
        if (result.recordset.length === 0) {
            throw new createHttpError.NotFound('درس یافت نشد')
        }
        const lesson_title = result.recordset[0].title

        return await this.#queries.deleteLessonByCode(code, lesson_title)
    }

    async getAll() {
        const result = await this.#queries.getAll()
        return result.recordset
    }
}

module.exports = { AdminLessonService: new AdminLessonService() }
