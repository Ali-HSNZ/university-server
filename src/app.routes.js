const { Router } = require('express')
const { AuthRouter } = require('./modules/auth/auth.routes')
const { AdminTeacherRoutes } = require('./modules/admin/teacher/admin.teacher.routes')
const { AdminLessonRoutes } = require('./modules/admin/lesson/admin.lesson.routes')
const { AdminClassRoutes } = require('./modules/admin/class/admin.class.routes')
const Authorization = require('./guard/authorization.guard')
const CheckAdminAccessibility = require('./guard/checkAdminAccessibility.guard')
const { TeacherClassRoutes } = require('./modules/teacher/class/teacher.class.routes')
const { TeacherProfileRoutes } = require('./modules/teacher/profile/teacher.profile.routes')
const mainRouter = Router()

mainRouter.use('/auth', AuthRouter)

// Admin Routes
mainRouter.use('/admin-teacher', Authorization, CheckAdminAccessibility, AdminTeacherRoutes)
mainRouter.use('/admin-lesson', Authorization, CheckAdminAccessibility, AdminLessonRoutes)
mainRouter.use('/admin-class', Authorization, CheckAdminAccessibility, AdminClassRoutes)

// Teacher Routes
mainRouter.use('/teacher-class', Authorization, TeacherClassRoutes)
mainRouter.use('/teacher', Authorization, TeacherProfileRoutes)

module.exports = mainRouter
