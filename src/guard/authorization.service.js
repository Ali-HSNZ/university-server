const autoBind = require('auto-bind')
const { AuthorizationQueries } = require('./authorization.query')
const createHttpError = require('http-errors')

class AuthorizationService {
    #queries

    constructor() {
        autoBind(this)
        this.#queries = AuthorizationQueries
    }

    async findUserByNationalCode(national_code) {
        const user = await this.#queries.findUserByNationalCode(national_code)
        return user.recordset[0]
    }

    checkAccessibly(type) {
        if (type === 'ADMIN') {
            if (req.user.type !== 0) {
                throw new createHttpError[403]()
            }
        }
    }
}

module.exports = { authorizationService: new AuthorizationService() }
