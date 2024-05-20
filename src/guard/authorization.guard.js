const createHttpError = require('http-errors')
const AuthorizationMessage = require('./authorization.message')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { cookieNames } = require('../common/constants/cookie')

const { authorizationService } = require('./authorization.service')

const Authorization = async (req, res, next) => {
    try {
        const token = req?.headers[cookieNames.AccessToken]

        if (!token) {
            throw createHttpError.Unauthorized(AuthorizationMessage.Login)
        }

        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (typeof data === 'object' && 'national_code' in data) {
            const user = await authorizationService.findUserByNationalCode(data.national_code)
            if (!user) {
                throw new createHttpError.Unauthorized(AuthorizationMessage.NotFoundAccount)
            }
            req.user = user
            return next()
        }

        throw new createHttpError.Unauthorized(AuthorizationMessage.InvalidToken)
    } catch (error) {
        next(error)
    }
}

module.exports = Authorization
