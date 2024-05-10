const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../config/mssql.config')

class AuthQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async findUserQuery(national_code, pass) {
        return await sql.query(
            `select * from [user] where national_code = ${national_code} and pass = '${pass}'`
        )
    }
    async signUserToken(token, national_code) {
        return await sql.query(
            `update [user] set token = '${token}' where national_code = ${national_code} `
        )
    }
}

module.exports = new AuthQueries()
