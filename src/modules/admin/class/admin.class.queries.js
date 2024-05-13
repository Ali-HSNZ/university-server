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

    async lessonsList() {
        return await sql.query(`
            SELECT lesson.title as label, lesson.lessonId as value from [lesson]
        `)
    }

    async deleteClassById(id) {
        return await sql.query(`delete from [class] where classId = ${id}`)
    }

    async checkExistLesson({ lesson_id, start_time, day }) {
        return await sql.query(`
            select lesson_title as title, start_time, day from [class]
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
}

module.exports = {
    AdminClassQueries: new AdminClassQueries(),
}
