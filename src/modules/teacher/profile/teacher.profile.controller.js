const autoBind = require('auto-bind')
const { TeacherProfileMessages } = require('./teacher.profile.messages')
const { TeacherProfileService } = require('./teacher.profile.service')

class TeacherProfileController {
    #service

    constructor() {
        autoBind(this)
        this.#service = TeacherProfileService
    }

    async profile(req, res, next) {
        try {
            const teacherCode = req.user.code
            const result = await this.#service.profile(teacherCode)

            res.status(200).json({
                code: 200,
                message: TeacherProfileMessages.Profile,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    TeacherProfileController: new TeacherProfileController(),
}
