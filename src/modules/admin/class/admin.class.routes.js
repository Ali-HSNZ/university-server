const { checkValidation } = require('../../../middlewares/check-validation')
const { AdminClassController } = require('./admin.class.controller')
const { adminCreateClassValidator } = require('./admin.class.validation')
const { upload } = require('../../../common/utils/multer-upload')
const { receiveExcelFile } = require('../../../middlewares/receive-excel-file')

const router = require('express').Router()

router.post('/create', adminCreateClassValidator(), checkValidation, AdminClassController.create)

router.post(
    '/bulk-create',
    upload.single('file'),
    receiveExcelFile,
    AdminClassController.bulkCreate
)
router.delete('/file/:fileName/delete/:fileId', AdminClassController.deleteFile)

router.get('/files/list', AdminClassController.allFiles)
router.put('/assign-by-file/:fileName/:fileId', AdminClassController.assignClassByFileName)
router.get('/pending-to-agree-class-file/list', AdminClassController.pendingToAgreeList)

router.delete(
    '/pending-to-agree-class-file/:fileName/delete/:fileId',
    AdminClassController.deleteFile
)

router.get('/lessons/list', AdminClassController.lessonsList)
router.get('/list', AdminClassController.getAll)
router.delete('/:id/delete', AdminClassController.deleteClassById)

module.exports = {
    AdminClassRoutes: router,
}
