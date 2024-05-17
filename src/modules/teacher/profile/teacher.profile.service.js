const autoBind = require('auto-bind')
const { TeacherProfileQueries } = require('./teacher.profile.queries')

class TeacherProfileService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = TeacherProfileQueries
    }

    async profile(teacherCode) {
        const result = await this.#queries.profile(teacherCode)
        return result.recordset[0]
    }
}

module.exports = {
    TeacherProfileService: new TeacherProfileService(),
}
