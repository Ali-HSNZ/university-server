const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../../config/mssql.config')

class AdminLessonQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async deleteFileByFileId(fileId) {
        return await sql.query(`delete from [files] where id = ${fileId}`)
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
                f.section = N'درس' AND f.is_show = 1
        `)
    }

    async createLessonFile(fileDto) {
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

    async create({ title, type, theory_unit, practical_unit, code }) {
        return await sql.query(`
            insert into [lesson] (
                title,
                code,
                theory_unit,
                practical_unit,
                type
            ) values (
                N'${title}',
                '${code}',
                ${theory_unit},
                ${practical_unit},
                N'${type}'
            )`)
    }

    async isExistLessonByTitle(title) {
        return await sql.query(`select * from [lesson] where title = N'${title}'`)
    }
    async getLessonIdByLessonTitle(title) {
        return await sql.query(`select lessonId from [lesson] where title = N'${title}'`)
    }

    async getLessonTitleByLessonCode(code) {
        return await sql.query(`select title from [lesson] where code = '${code}'`)
    }

    async isExistLessonByCode(code) {
        return await sql.query(`select * from [lesson] where code = '${code}'`)
    }

    async deleteLessonByCode(lesson_code, lesson_title) {
        return await sql.query(`
            BEGIN TRANSACTION;
                DELETE FROM [class] WHERE lesson_title = N'${lesson_title}';
                DELETE FROM [lesson] WHERE code = '${lesson_code}';
            COMMIT;
        `)
    }

    async getAll() {
        return await sql.query('select * from [lesson]')
    }
}

module.exports = {
    AdminLessonQueries: new AdminLessonQueries(),
}
