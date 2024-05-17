const { TeacherClassController } = require('./teacher.class.controller')

const router = require('express').Router()

router.get('/list', TeacherClassController.getAll)

module.exports = {
    TeacherClassRoutes: router,
}
