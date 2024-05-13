const { checkValidation } = require('../../../middlewares/check-validation')
const { AdminClassController } = require('./admin.class.controller')
const { adminCreateClassValidator } = require('./admin.class.validation')

const router = require('express').Router()

router.post('/create', adminCreateClassValidator(), checkValidation, AdminClassController.create)
router.get('/lessons/list', AdminClassController.lessonsList)
router.get('/list', AdminClassController.getAll)
router.delete('/:id/delete', AdminClassController.deleteClassById)

module.exports = {
    AdminClassRoutes: router,
}
