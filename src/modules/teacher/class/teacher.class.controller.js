const autoBind = require('auto-bind')
const { TeacherClassMessages } = require('./teacher.class.messages')
const { TeacherClassService } = require('./teacher.class.service')

class TeacherClassController {
    #service

    constructor() {
        autoBind(this)
        this.#service = TeacherClassService
    }

    async profile(req, res, next) {
        try {
            const teacherCode = req.user.code
            const result = await this.#service.profile(teacherCode)

            res.status(200).json({
                code: 200,
                message: TeacherClassMessages.TeacherProfile,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const userCode = req.user.code

            const result = await this.#service.getAll(userCode)

            res.status(200).json({
                code: 200,
                message: TeacherClassMessages.ClassList,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    TeacherClassController: new TeacherClassController(),
}
