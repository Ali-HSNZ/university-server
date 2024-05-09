const autoBind = require('auto-bind')
const authQueries = require('./auth.queries')

class AuthService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = authQueries
    }
    async login(national_code, password) {
        const user = await this.isExistUser(national_code, password)
    }
    async isExistUser(national_code, password) {
        const user = await this.#queries.findUserQuery(national_code, password).recordset
        //
        if (user.length === 0) return false
        return user
    }
    async createUser() {
        return await this.#queries.createUser()
    }
}

module.exports = new AuthService()
