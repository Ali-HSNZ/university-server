const { checkValidation } = require('../../../middlewares/check-validation')
const { AdminLessonController } = require('./admin.lesson.controller')
const { adminCreateLessonValidator } = require('./admin.lesson.validation')
const { receiveExcelFile } = require('../../../middlewares/receive-excel-file')
const router = require('express').Router()
const { upload } = require('../../../common/utils/multer-upload')

router.post('/create', adminCreateLessonValidator(), checkValidation, AdminLessonController.create)

router.post(
    '/bulk-create',
    upload.single('file'),
    receiveExcelFile,
    AdminLessonController.bulkCreate
)
router.get('/files/list', AdminLessonController.allFiles)

router.get('/list', AdminLessonController.list)
router.delete('/:id/delete', AdminLessonController.delete)

module.exports = {
    AdminLessonRoutes: router,
}
