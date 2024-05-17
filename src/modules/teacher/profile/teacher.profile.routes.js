const { TeacherProfileController } = require('./teacher.profile.controller')

const router = require('express').Router()

router.get('/profile', TeacherProfileController.profile)

module.exports = {
    TeacherProfileRoutes: router,
}
