const { generateUniqueCode } = require('../../../utils/generate-unique-code')
const { AdminLessonMessages } = require('./admin.lesson.messages')
const { AdminLessonQueries } = require('./admin.lesson.queries')

class AdminLessonService {
    #queries

    constructor() {
        this.#queries = AdminLessonQueries
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

    async deleteLessonById(code) {
        return await this.#queries.deleteLessonByCode(code)
    }

    async getAll() {
        const result = await this.#queries.getAll()
        return result.recordset
    }
}

module.exports = { AdminLessonService: new AdminLessonService() }
