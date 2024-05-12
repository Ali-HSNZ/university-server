const { checkValidation } = require('../../../middlewares/check-validation')
const { adminTeacherController } = require('./admin.teacher.controller')
const { adminCreateTeacherValidator } = require('./admin.teacher.validation')

const router = require('express').Router()

router.post(
    '/create',
    adminCreateTeacherValidator(),
    checkValidation,
    adminTeacherController.create
)
router.get('/teachers/list', adminTeacherController.allTeachers)
router.get('/:id/class/list', adminTeacherController.classList)
router.delete('/:teacherCode/class/:classId', adminTeacherController.deleteClass)

router.post('/assignment-class', adminTeacherController.assignmentClass)
router.delete('/delete-class', adminTeacherController.deleteClass)
router.put('/edit-profile', adminTeacherController.editProfile)

module.exports = {
    AdminTeacherRoutes: router,
}
