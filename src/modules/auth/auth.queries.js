const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../config/mssql.config')

class AuthQueries {
    constructor() {
        autoBind(this)
    }

    async queryDB(query) {
        let pool = await sql.connect(mssqlConfig)

        const result = await pool.request().query(query)
        await sql.close()

        return result
    }

    async findUserQuery(national_code, pass) {
        return await this.queryDB(
            `select * from [user] where national_code = ${national_code} and pass = '${pass}'`
        )
    }
    async checkIsFirstUser() {
        return await this.queryDB(`select * from [user] `)
    }
    async createFirstUser(national_code, pass) {
        return await this.queryDB(
            `insert into [user] (
                national_code,
                pass,
                type
            ) values (
                '${national_code}',
                '${pass}',
                1
            )`
        )
    }
    async signUserToken(token, national_code) {
        return await this.queryDB(
            `update [user] set token = '${token}' where national_code = ${national_code} `
        )
    }
}

module.exports = new AuthQueries()
