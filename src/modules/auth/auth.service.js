const autoBind = require('auto-bind')
const authQueries = require('./auth.queries')
const { AuthMessage } = require('./auth.messages')
const { tokenGenerator } = require('../../common/utils/token-generate')
const createHttpError = require('http-errors')

class AuthService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = authQueries
    }
    async login(national_code, pass) {
        const user = await this.isExistUser(national_code, pass)
        const token = tokenGenerator({ national_code })
        await this.signUserToken(token, national_code)
        return user
    }
    async isExistUser(national_code, pass) {
        const user = await this.#queries.findUserQuery(national_code, pass)
        if (user.recordset.length === 0) throw new createHttpError.NotFound(AuthMessage.NotFound)
        else return user.recordset[0]
    }

    async signUserToken(token, national_code) {
        await this.#queries.signUserToken(token, national_code)
    }
    async createUser() {
        return await this.#queries.createUser()
    }
}

module.exports = new AuthService()
