const { checkValidation } = require('../../../middlewares/check-validation')
const { AdminLessonController } = require('./admin.lesson.controller')
const { adminCreateLessonValidator } = require('./admin.lesson.validation')

const router = require('express').Router()

router.post('/create', adminCreateLessonValidator(), checkValidation, AdminLessonController.create)
router.get('/list', AdminLessonController.list)
router.delete('/:id/delete', AdminLessonController.delete)

module.exports = {
    AdminLessonRoutes: router,
}
