const { AdminClassQueries } = require('./admin.class.queries')

class AdminClassService {
    #queries

    constructor() {
        this.#queries = AdminClassQueries
    }

    async create(lessonDTO) {
        const { title, start_time, end_time, day, test_date, test_time, lesson_id } = lessonDTO
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

    async checkExistLesson({ lesson_id, start_time, day }) {
        const result = await this.#queries.checkExistLesson({ lesson_id, start_time, day })
        return result.recordset
    }

    async getLessonTitleById(lesson_id) {
        const result = await this.#queries.getLessonTitleById(lesson_id)
        if (result.recordset.length !== 0) return result.recordset[0]
        return false
    }

    async getAll() {
        const result = await this.#queries.getAll()
        return result.recordset
    }
}

module.exports = { AdminClassService: new AdminClassService() }
