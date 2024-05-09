const { Router } = require('express')
const authController = require('./auth.controller')
const Authorization = require('../../common/guard/authorization.guard')
const { authValidator } = require('./auth.validation')
const { checkValidation } = require('../../middlewares/check-validation')

const router = Router()

router.post('/login', authValidator(), checkValidation, authController.login)
router.get('/logout', authController.logout)

module.exports = {
    AuthRouter: router,
}
