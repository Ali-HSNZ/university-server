const CookieNames = require('../../common/constants/cookie.enum')
const { AuthMessage } = require('./auth.messages')
const authService = require('./auth.service')
const autoBind = require('auto-bind')

class AuthController {
    #service

    constructor() {
        autoBind(this)
        this.#service = authService
    }
    async login(req, res, next) {
        try {
            const { national_code, password } = req.body
            const user = await this.#service.isExistUser(national_code, password)
            if (!user) {
                res.status(404).send({
                    code: 404,
                    data: null,
                    message: AuthMessage.NotFound,
                })
            } else {
                res.send({
                    code: 404,
                    data: null,
                    message: 'کاربر یافت نشد',
                })
            }
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            return res.clearCookie(CookieNames.AccessToken).status(200).json({
                message: AuthMessage.LogoutSuccessfully,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()
