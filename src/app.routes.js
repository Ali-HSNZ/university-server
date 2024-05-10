const { Router } = require('express')
const { AuthRouter } = require('./modules/auth/auth.routes')
const { AdminTeacherRoutes } = require('./modules/admin/teacher/admin.teacher.routes')

const mainRouter = Router()

mainRouter.use('/auth', AuthRouter)
mainRouter.use('/admin-teacher', AdminTeacherRoutes)

module.exports = mainRouter
