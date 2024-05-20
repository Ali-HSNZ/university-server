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
    async isExistTeacherByCode(code) {
        return await sql.query(
            `select first_name, last_name, code as teacher_code from [user] where code = '${code}'`
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

    async update({
        first_name,
        last_name,
        national_code,
        mobile,
        birthDay,
        gender,
        education,
        address,
        id,
        pass,
    }) {
        return await sql.query(
            `UPDATE [user]
                SET
                    first_name = N'${first_name}',
                    last_name = N'${last_name}',
                    national_code = '${national_code}',
                    mobile = '${mobile}',
                    birthDay = '${birthDay}',
                    gender = N'${gender}',
                    education = N'${education}',
                    address = N'${address}',
                    pass = '${pass}' where userId = '${id}'

        `
        )
    }

    async createTeacherFile(fileDto) {
        const { first_name, last_name, user_type, section, file_path, is_show, date } = fileDto

        console.log('date : ', date)

        return await sql.query(
            `insert into [files] (
                first_name,
                last_name,
                user_type,
                section,
                file_path,
                is_show,
                date
            ) values (
                N'${first_name}',
                N'${last_name}',
                '${user_type}',
                N'${section}',
                '${file_path}',
                ${is_show},
                N'${date}'
            )`
        )
    }

    async getAllFiles() {
        return await sql.query(`select * from [files] where section = N'استاد'`)
    }

    async allTeacher() {
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
    async deleteTeacherByCode(code) {
        return await sql.query(`delete from [user] where code = '${code}'`)
    }
    async deleteClassByTeacherCode(teacherCode, class_id) {
        console.log({ teacherCode, class_id })
        return await sql.query(
            `UPDATE [class]
                SET  user_code = '' WHERE user_code = '${teacherCode}' AND classId = '${class_id}'`
        )
    }

    // Assignment Class Section =>
    // uniq class title
    async assignmentClassTitleList() {
        return await sql.query(
            `SELECT DISTINCT lessonId as value,lesson_title as label FROM [class]`
        )
    }
    // class day
    async assignmentClassDayList(lessonId) {
        return await sql.query(`
            select DISTINCT day from [class] where lessonId = ${lessonId}
        `)
    }

    // class time by day
    async assignmentClassTimeList({ lessonId, day }) {
        return await sql.query(`
            select start_time, end_time from [class] where lessonId = ${lessonId} and day = N'${day}'
        `)
    }

    // class test by name, day, time
    async assignmentClassTest({ lessonId, day, start_time }) {
        return await sql.query(`
            select test_date, test_time from [class] where
                lessonId = ${lessonId} and
                day = N'${day}' and
                start_time = N'${start_time}'
        `)
    }
    // create assignClass
    async assignmentClassToTeacher({ userId, user_code, classId, day, start_time }) {
        return await sql.query(`
          UPDATE [class]
        SET userId = ${userId}, user_code = '${user_code}'
        WHERE
            lessonId = '${classId}' AND
            day = N'${day}' AND
            start_time = N'${start_time}'
                `)
    }

    async getProfile(userId) {
        return await sql.query(`select * from [user] where code = ${userId}`)
    }
}

module.exports = new AdminTeacherQueries()
