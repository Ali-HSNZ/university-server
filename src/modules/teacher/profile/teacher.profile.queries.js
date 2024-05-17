const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../../config/mssql.config')

class TeacherProfileQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async profile(teacherCode) {
        return await sql.query(`
            select * from [user] where code = '${teacherCode}'
        `)
    }
}

module.exports = {
    TeacherProfileQueries: new TeacherProfileQueries(),
}
