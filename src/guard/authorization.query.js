const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../src/config/mssql.config')

class AuthorizationQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        sql.connect(mssqlConfig).catch((err) => err)
    }

    async findUserByNationalCode(national_code) {
        return await sql.query(`select * from [user] where national_code = '${national_code}'`)
    }
}

module.exports = { AuthorizationQueries: new AuthorizationQueries() }
