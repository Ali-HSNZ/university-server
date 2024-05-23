const createHttpError = require('http-errors')
const { AdminClassQueries } = require('./admin.class.queries')
const { adminCreateClassExcelValidator } = require('./admin.class.validation')
const { mapLabelsToValues } = require('../../../common/utils/map-labels-to-values')
const xlsx = require('xlsx')
const { adminTeacherService } = require('../teacher/admin.teacher.service')
const { getDayCode } = require('../../../common/utils/get-code-by-day')
const { replaceNumbersWithPersian } = require('../../../common/utils/replace-numbers-with-persian')
const replaceNumbersWithPersianUtils = require('../../../common/utils/replace-numbers-with-persian/replace-numbers-with-persian.utils')
const autoBind = require('auto-bind')
const { findFile } = require('../../../common/utils/find-file')

class AdminClassService {
    #queries
    #teacherService
    constructor() {
        autoBind(this)
        this.#queries = AdminClassQueries
        this.#teacherService = adminTeacherService
    }

    async bulkCreate(classesList, user, fileUrl) {
        const classesDTO = this.convertExcelToValidData(classesList)

        for (const lesson of classesDTO) {
            const lesson_id = await this.getLessonIdByTitle(lesson.title)
            const { day, start_time } = lesson

            if (!lesson_id) {
                throw new createHttpError.BadRequest('عنوان درس یافت نشد')
            }

            const availableLesson = await this.checkExistLesson({
                lesson_id,
                day,
                start_time: replaceNumbersWithPersianUtils(start_time),
            })

            if (availableLesson.length > 0) {
                const errorMessage = `درس ${lesson.title} در ساعت ${start_time} در روز ${day} تشکیل می‌شود`
                throw new createHttpError(errorMessage)
            }

            await this.create({
                title: lesson.title,
                start_time: replaceNumbersWithPersianUtils(start_time),
                end_time: replaceNumbersWithPersianUtils(lesson.end_time),
                day,
                test_date: replaceNumbersWithPersianUtils(lesson.test_date),
                test_time: replaceNumbersWithPersianUtils(lesson.test_time),
                lesson_id,
            })
        }
        await this.createClassFile(user, fileUrl)
    }
    async deleteFileByFileId(fileId) {
        return await this.#queries.deleteFileByFileId(fileId)
    }
    async assignClassByFileName(fileName, fileId) {
        const file = findFile(fileName)

        const workBook = xlsx.readFile(file)
        const sheetName = workBook.SheetNames[0]

        const data = xlsx.utils.sheet_to_json(workBook.Sheets[sheetName])

        const validData = this.convertExcelToValidData(data)

        const availableUser = await this.#queries.getUserByFileId(fileId)
        if (availableUser.recordset.length === 0) {
            throw new createHttpError.NotFound('کاربر یافت نشد')
        }
        const user = availableUser.recordset[0]

        for (const singleClass of validData) {
            const dayCode = getDayCode(singleClass.day)
            const lesson_id = await this.getLessonIdByTitle(singleClass.title)

            const availableClass = await this.checkExistLesson({
                day: singleClass.day,
                lesson_id,
                start_time: replaceNumbersWithPersian(singleClass.start_time),
            })

            if (availableClass.length === 0) {
                throw new createHttpError.NotFound('کلاس یافت نشد')
            }

            await this.#teacherService.assignmentClassToTeacher({
                dayCode: dayCode,
                teacherCode: user.code,
                start_time: replaceNumbersWithPersian(singleClass.start_time),
                classId: lesson_id,
            })
        }
        await this.#queries.changeIsShowClassFile(fileId)

        return 'OK'
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
            is_show: 1,
            date: createFileDate,
            userId: user.userId,
        })
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

    async validateBulkCreateExcelFile(req) {
        const errors = await Promise.all(
            adminCreateClassExcelValidator.map((validation) => validation.run(req))
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

    async create(classDTO) {
        const { title, start_time, end_time, day, test_date, test_time, lesson_id } = classDTO
        return await this.#queries.create({
            title,
            lesson_id,
            start_time,
            end_time,
            day,
            test_date,
            test_time,
        })
    }

    async getAll() {
        const result = await this.#queries.getAll()
        return result.recordset
    }

    async deleteClassById(id) {
        return await this.#queries.deleteClassById(id)
    }

    async lessonsList() {
        const result = await this.#queries.lessonsList()
        return result.recordset.map((item) => ({
            ...item,
            value: item.value.toString(),
        }))
    }
    async getAllFiles() {
        const result = await this.#queries.getAllFiles()
        return result.recordset
    }
    async getPendingToAgreeList() {
        const result = await this.#queries.getPendingToAgreeList()
        return result.recordset
    }
    async checkExistLesson({ lesson_id, start_time, day }) {
        const result = await this.#queries.checkExistLesson({ lesson_id, start_time, day })
        return result.recordset
    }

    async getLessonTitleById(lesson_id) {
        const result = await this.#queries.getLessonTitleById(lesson_id)
        if (result.recordset.length !== 0) return result.recordset[0]
        return false
    }

    async getLessonIdByTitle(title) {
        const result = await this.#queries.getLessonIdByTitle(title)
        if (result.recordset.length !== 0) return result.recordset[0]?.lessonId
        return false
    }

    async getAll() {
        const result = await this.#queries.getAll()
        return result.recordset
    }
}

module.exports = { AdminClassService: new AdminClassService() }
