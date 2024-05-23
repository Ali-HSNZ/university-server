const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../../config/mssql.config')

class AdminClassQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async getAll() {
        return await sql.query(
            `select classId as id,
                lesson_title as title,
                start_time,
                end_time,
                day,
                test_date,
                test_time
            from [class]`
        )
    }

    async getLessonTitleById(lesson_id) {
        return await sql.query(`select title from [lesson] where lessonId = '${lesson_id}'`)
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

    async changeIsShowClassFile(fileId) {
        return await sql.query(`update [files] set is_show = 1 where id = ${fileId}`)
    }
    async getUserByFileId(fileId) {
        return await sql.query(`
            SELECT u.*
                FROM [files] f
            JOIN [user] u ON f.userId = u.userId
            WHERE f.id = ${fileId}`)
    }

    async getLessonIdByTitle(title) {
        return await sql.query(`select lessonId from [lesson] where title = N'${title}'`)
    }

    async getPendingToAgreeList() {
        return await sql.query(`
            SELECT
                f.first_name,
                f.last_name,
                f.file_path,
                f.date,
                f.id as fileId,
                u.code as user_code
            FROM
                [files] f
            JOIN
                [user] u ON f.userId = u.userId
            WHERE
                f.is_show = 0
        `)
    }

    async lessonsList() {
        return await sql.query(`
            SELECT lesson.title as label, lesson.lessonId as value from [lesson]
        `)
    }
    async deleteFileByFileId(fileId) {
        return await sql.query(`delete from [files] where id = ${fileId}`)
    }
    async deleteClassById(id) {
        return await sql.query(`delete from [class] where classId = ${id}`)
    }

    async checkExistLesson({ lesson_id, start_time, day }) {
        return await sql.query(`
            select lesson_title as title, start_time, day, classId from [class]
            where lessonId = ${lesson_id} and start_time = N'${start_time}' and day = N'${day}'
        `)
    }

    async create({ title, start_time, end_time, day, test_date, test_time, lesson_id }) {
        return await sql.query(`
            insert into [class] (
                lessonId,
                lesson_title,
                start_time,
                end_time,
                day,
                test_date,
                test_time
            ) values (
                ${lesson_id},
                N'${title}',
                N'${start_time}',
                N'${end_time}',
                N'${day}',
                N'${test_date}',
                N'${test_time}'
            )
        `)
    }
    async getAllFiles() {
        return await sql.query(`
            SELECT
                f.first_name,
                f.last_name,
                f.file_path,
                f.date,
                f.id as fileId,
                u.code as user_code
            FROM
                [files] f
            JOIN
                [user] u ON f.userId = u.userId
            WHERE
                f.section = N'کلاس' AND f.is_show = 1
        `)
    }
}

module.exports = {
    AdminClassQueries: new AdminClassQueries(),
}
