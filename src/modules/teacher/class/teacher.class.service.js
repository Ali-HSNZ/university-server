const autoBind = require('auto-bind')
const { TeacherClassQueries } = require('./teacher.class.queries')

class TeacherClassService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = TeacherClassQueries
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
