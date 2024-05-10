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
            const { national_code, pass } = req.body

            const user = await this.#service.login(national_code, pass)

            return res.status(200).json({
                message: AuthMessage.LoginSuccessfully,
                code: 200,
                data: {
                    token: user.token,
                    userType: !user.type || user.type === 0 ? 'teacher' : 'admin',
                },
            })
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
