const autoBind = require('auto-bind')
const authQueries = require('./auth.queries')
const { AuthMessage } = require('./auth.messages')
const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')

class AuthService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = authQueries
    }
    async login(national_code, pass) {
        const isFirstUser = await this.checkIsFirstUser()

        if (!isFirstUser) {
            const user = await this.isExistUser(national_code, pass)
            const token = this.signToken({
                national_code,
                userType: user.type === 1 ? 'admin/teachers' : 'user',
            })

            return { user_type: user.type, token }
        } else {
            const token = this.signToken({
                national_code,
                userType: 'admin/teachers',
            })
            await this.#queries.createFirstUser(national_code, pass)
            return { user_type: 1, token }
        }
    }

    async checkIsFirstUser() {
        const users = await this.#queries.checkIsFirstUser()
        if (users.recordset.length === 0) return true
        return false
    }

    async isExistUser(national_code, pass) {
        const user = await this.#queries.findUserQuery(national_code, pass)
        if (user.recordset.length === 0) throw new createHttpError.NotFound(AuthMessage.NotFound)
        else return user.recordset[0]
    }

    signToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1y' })
    }
    async createUser() {
        return await this.#queries.createUser()
    }
}

module.exports = new AuthService()
