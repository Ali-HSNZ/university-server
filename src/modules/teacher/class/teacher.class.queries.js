const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../../config/mssql.config')

class TeacherClassQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }
    async getLessonIdByTitle(title) {
        return await sql.query(`select lessonId from [lesson] where title = N'${title}'`)
    }

    async checkExistLesson({ lesson_id, start_time, day }) {
        return await sql.query(`
            select lesson_title as title, start_time, day from [class]
            where lessonId = ${lesson_id} and start_time = N'${start_time}' and day = N'${day}'
        `)
    }

    async checkAssignClass({ lesson_id, start_time, day }) {
        return await sql.query(`
            SELECT lesson_title AS title, start_time, day
            FROM [class]
            WHERE lessonId = ${lesson_id}
            AND start_time = N'${start_time}'
            AND day = N'${day}'
            AND UserId IS NULL
        `)
    }

    async checkTeacherAbleToAssignClassFile(userId) {
        return await sql.query(`
            select * from [files] where userId = '${userId}' and is_show = 0
        `)
    }

    async createClassFile(fileDto) {
        const { first_name, last_name, user_type, section, file_path, is_show, date, userId } =
            fileDto

        return await sql.query(
            `insert into [files] (
                first_name,
                last_name,
                user_type,
                section,
                file_path,
                is_show,
                date,
                userId
            ) values (
                N'${first_name}',
                N'${last_name}',
                '${user_type}',
                N'${section}',
                '${file_path}',
                ${is_show},
                N'${date}',
                '${userId}'
            )`
        )
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async getAll(userId) {
        return await sql.query(`
            select * from [class] where userId = '${userId}'
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
