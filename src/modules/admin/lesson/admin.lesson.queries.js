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

    async getAllFiles() {
        return await sql.query(`select * from [files] where section = N'درس'`)
    }

    async createLessonFile(fileDto) {
        const { first_name, last_name, user_type, section, file_path, is_show, date } = fileDto

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

    async isExistLessonByCode(code) {
        return await sql.query(`select * from [lesson] where code = '${code}'`)
    }

    async deleteLessonByCode(code) {
        return await sql.query(`delete from [lesson] where code = '${code}'`)
    }

    async getAll() {
        return await sql.query('select * from [lesson]')
    }
}

module.exports = {
    AdminLessonQueries: new AdminLessonQueries(),
}
