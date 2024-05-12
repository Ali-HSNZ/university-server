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
    async isExistTeacherByMobile(mobile) {
        return await sql.query(`select * from [user] where mobile = '${mobile}'`)
    }
    filedConvertor = (tableName = '', filed = []) => {
        let result = ''
        filed.forEach((item) => {
            result += ` ${tableName}.${item},`
        })
        return result.replace(/,$/, '')
    }
    async isExistTeacherByCode(code) {
        return await sql.query(
            `select ${this.filedConvertor('[user]', ['first_name', 'last_name', 'code as teacher_code'])} from [user] where code = '${code}'`
        )
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

    // Query to retrieve teachers with class_count
    async allTeacher() {
        // return await sql.query(`
        //     SELECT u.userId AS userId,
        //         u.first_name,
        //         u.last_name,
        //         u.code,
        //         u.national_code,
        //         COUNT(c.userId) AS class_count
        //     FROM [user] u
        //     LEFT JOIN class c ON u.userId = c.userId
        //     WHERE NOT EXISTS (
        //         SELECT 1 FROM [user] u2 WHERE u2.userId = u.userId AND u2.type = 1
        //     )
        //     GROUP BY u.userId,
        //         u.first_name,
        //         u.last_name,
        //         u.code,
        //         u.national_code
        // `)
        return await sql.query(`
            SELECT
                u.userId AS userId,
                u.first_name,
                u.last_name,
                u.code,
                u.national_code,
                COUNT(c.user_code) AS class_count
            FROM
                [user] u
            LEFT JOIN
                class c ON u.code = c.user_code
            WHERE
                NOT EXISTS (SELECT 1 FROM [user] u2 WHERE u2.userId = u.userId AND u2.type = 1)
            GROUP BY
                u.userId,
                u.first_name,
                u.last_name,
                u.code,
                u.national_code;
    `)
    }
    async teacherClassList(teacherCode) {
        return await sql.query(`
            SELECT [class].classId as id,
                [class].lesson_title as title,
                [class].start_time,
                [class].end_time,
                [class].day,
                [class].test_date,
                [class].test_time
            FROM class
            LEFT JOIN [user] ON [class].user_code = [user].code
            where [class].user_code = '${teacherCode}'
        `)
    }

    async deleteClassByTeacherCode(teacherCode, class_id) {
        return await sql.query(
            `delete from [class] where user_code = '${teacherCode}' and classId = ${class_id}`
        )
    }
}

module.exports = new AdminTeacherQueries()
