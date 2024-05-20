const { upload } = require('../../../common/utils/multer-upload')
const { checkValidation } = require('../../../middlewares/check-validation')
const { receiveExcelFile } = require('../../../middlewares/receive-excel-file')

const { adminTeacherController } = require('./admin.teacher.controller')

const {
    adminCreateTeacherValidator,
    adminUpdateTeacherValidator,
} = require('./admin.teacher.validation')

const router = require('express').Router()

router.post(
    '/create',
    adminCreateTeacherValidator(),
    checkValidation,
    adminTeacherController.create
)

router.post(
    '/bulk-create',
    upload.single('file'),
    receiveExcelFile,
    adminTeacherController.bulkCreate
)

router.get('/:id/info', adminTeacherController.teacherProfile)

router.put(
    '/:id/update',
    adminUpdateTeacherValidator(),
    checkValidation,
    adminTeacherController.update
)

router.get('/files/list', adminTeacherController.allFiles)

router.get('/teachers/list', adminTeacherController.allTeachers)
router.get('/:id/class/list', adminTeacherController.classList)
router.delete('/:teacherCode/class/:classId', adminTeacherController.deleteClass)
router.delete('/:teacherCode/delete', adminTeacherController.delete)

router.post('/assignment-class/create', adminTeacherController.createAssignmentClass)

// class names
router.get('/assignment-class/list', adminTeacherController.assignmentClassTitleList)
// class days
router.get('/assignment-class/:id/day/list', adminTeacherController.assignmentClassDayList)
// class time
router.get(
    '/assignment-class/lesson/:lessonId/day/:dayId/list',
    adminTeacherController.assignmentClassTimeList
)
// class test
router.get(
    '/assignment-class/lesson/:lessonId/day/:dayId/start_time/:start_time/test',
    adminTeacherController.assignmentClassTest
)

router.delete('/delete-class', adminTeacherController.deleteClass)

module.exports = {
    AdminTeacherRoutes: router,
}
