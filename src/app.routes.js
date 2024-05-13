const { Router } = require('express')
const { AuthRouter } = require('./modules/auth/auth.routes')
const { AdminTeacherRoutes } = require('./modules/admin/teacher/admin.teacher.routes')
const { AdminLessonRoutes } = require('./modules/admin/lesson/admin.lesson.roues')
const { AdminClassRoutes } = require('./modules/admin/class/admin.class.routes')

const mainRouter = Router()

mainRouter.use('/auth', AuthRouter)
mainRouter.use('/admin-teacher', AdminTeacherRoutes)
mainRouter.use('/admin-lesson', AdminLessonRoutes)
mainRouter.use('/admin-class', AdminClassRoutes)

module.exports = mainRouter
