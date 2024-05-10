const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../../config/mssql.config')

class AdminTeacherQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async isExistTeacherByNational_code(national_code) {
        return await sql.query(`select * from [user] where national_code = '${national_code}'`)
    }
    async isExistTeacherByMobile(mobile) {
        return await sql.query(`select * from [user] where mobile = '${mobile}'`)
    }
    async create({
        first_name,
        last_name,
        national_code,
        mobile,
        birthDay,
        gender,
        education,
        address,
        teacherCode,
    }) {
        return await sql.query(
            `insert into [user] (
                first_name,
                last_name,
                national_code,
                mobile,
                birthDay,
                gender,
                education,
                address,
                type,
                pass,
                code
            ) values (
                N'${first_name}',
                N'${last_name}',
                '${national_code}',
                '${mobile}',
                '${birthDay}',
                N'${gender}',
                N'${education}',
                N'${address}',
                '0',
                '${mobile}',
                '${teacherCode}'
            )`
        )
    }
}

module.exports = new AdminTeacherQueries()
