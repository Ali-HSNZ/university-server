const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../../config/mssql.config')

class TeacherClassQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async getAll(teacherCode) {
        return await sql.query(`
            select * from [class] where user_code = '${teacherCode}'
        `)
    }
    async profile(teacherCode) {
        return await sql.query(`
            select * from [user] where user_code = '${teacherCode}'
        `)
    }
}

module.exports = {
    TeacherClassQueries: new TeacherClassQueries(),
}
