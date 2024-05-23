const autoBind = require('auto-bind')
const { TeacherClassQueries } = require('./teacher.class.queries')
const { teacherCreateClassExcelValidator } = require('./teacher.class.validation')
const { mapLabelsToValues } = require('../../../common/utils/map-labels-to-values')
const createHttpError = require('http-errors')
const { replaceNumbersWithPersian } = require('../../../common/utils/replace-numbers-with-persian')
const { TeacherClassMessages } = require('./teacher.class.messages')

class TeacherClassService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = TeacherClassQueries
    }
    async validateBulkCreateExcelFile(req) {
        const errors = await Promise.all(
            teacherCreateClassExcelValidator.map((validation) => validation.run(req))
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
    convertExcelToValidData(data) {
        const columns = [
            { value: 'title', label: 'نام درس' },
            { value: 'start_time', label: 'ساعت شروع کلاس' },
            { value: 'end_time', label: 'ساعت پایان کلاس' },
            { value: 'day', label: 'روز برگزاری کلاس' },
            { value: 'test_date', label: 'تاریخ آزمون' },
            { value: 'test_time', label: 'ساعت برگزاری آزمون' },
        ]

        return mapLabelsToValues(data, columns)
    }

    async getLessonIdByTitle(title) {
        const result = await this.#queries.getLessonIdByTitle(title)
        if (result.recordset.length !== 0) return result.recordset[0]?.lessonId
        return false
    }
    async checkExistLesson({ lesson_id, start_time, day }) {
        const result = await this.#queries.checkExistLesson({ lesson_id, start_time, day })
        return result.recordset
    }

    async createClassFile(user, fileUrl) {
        const currentDate = new Date()

        const createFileDate =
            currentDate.toLocaleDateString('fa-IR') +
            ' | ' +
            currentDate.toLocaleTimeString('fa-IR')

        await this.#queries.createClassFile({
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.type,
            section: 'کلاس',
            file_path: fileUrl,
            is_show: 0,
            date: createFileDate,
            userId: user.userId,
        })
    }

    async checkTeacherAbleToAssignClassFile(userId) {
        const result = await this.#queries.checkTeacherAbleToAssignClassFile(userId)
        return result.recordset
    }

    async bulkAssign(classesList, user, fileUrl) {
        const classesDTO = this.convertExcelToValidData(classesList)

        const teacherAbleToAssignFile = await this.checkTeacherAbleToAssignClassFile(user.userId)

        if (teacherAbleToAssignFile.length >= 1) {
            throw new createHttpError(TeacherClassMessages.CannotSendAssignFileRequest)
        }

        for (const lesson of classesDTO) {
            const lesson_id = await this.getLessonIdByTitle(lesson.title)
            const { day, start_time } = lesson

            if (!lesson_id) {
                throw new createHttpError.BadRequest(TeacherClassMessages.LessonNotFound)
            }

            const availableClass = await this.checkExistLesson({
                lesson_id,
                day,
                start_time: replaceNumbersWithPersian(start_time),
            })
            if (availableClass.length === 0) {
                throw new createHttpError(TeacherClassMessages.LessonNotFound)
            }

            const assignedClass = await this.#queries.checkAssignClass({
                lesson_id,
                day,
                start_time: replaceNumbersWithPersian(start_time),
            })

            if (assignedClass.recordset.length === 0) {
                throw new createHttpError('کلاس مورد نظر توسط استاد دیگری انتخاب شده است')
            }
        }
        await this.createClassFile(user, fileUrl)
    }
    async getAll(teacherCode) {
        const result = await this.#queries.getAll(teacherCode)
        return result.recordset
    }

    async profile(teacherCode) {
        const result = await this.#queries.profile(teacherCode)
        return result.recordset[0]
    }
}

module.exports = {
    TeacherClassService: new TeacherClassService(),
}
