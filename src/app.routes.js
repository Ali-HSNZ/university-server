const { Router } = require('express')
const { AuthRouter } = require('./modules/auth/auth.routes')
const { AdminTeacherRoutes } = require('./modules/admin/teacher/admin.teacher.routes')
const { AdminLessonRoutes } = require('./modules/admin/lesson/admin.lesson.roues')

const mainRouter = Router()

mainRouter.use('/auth', AuthRouter)
mainRouter.use('/admin-teacher', AdminTeacherRoutes)
mainRouter.use('/admin-lesson', AdminLessonRoutes)

module.exports = mainRouter
