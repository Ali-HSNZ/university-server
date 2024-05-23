const { TeacherClassController } = require('./teacher.class.controller')

const router = require('express').Router()
const { upload } = require('../../../common/utils/multer-upload')
const { receiveExcelFile } = require('../../../middlewares/receive-excel-file')

router.get('/list', TeacherClassController.getAll)

router.post('/assign', upload.single('file'), receiveExcelFile, TeacherClassController.assign)

module.exports = {
    TeacherClassRoutes: router,
}
