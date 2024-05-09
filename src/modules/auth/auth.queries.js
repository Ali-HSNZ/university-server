const autoBind = require('auto-bind')
const sql = require('mssql/msnodesqlv8')
const mssqlConfig = require('../../config/mssql.config')
const createHttpError = require('http-errors')

class AuthQueries {
    constructor() {
        autoBind(this)
        this.connectDB()
    }

    async connectDB() {
        await sql.connect(mssqlConfig)
    }

    async findUserQuery(national_code, pass) {
        return await sql.query(
            `select * from teacher where national_code = ${national_code} and pass = '${pass}'`
        )
    }
    async createUser() {
        return await sql.query(
            `insert into teacher (national_code, pass,type) values (4990211162,3rvdvdfv,1)`
        )
    }
}

module.exports = new AuthQueries()
