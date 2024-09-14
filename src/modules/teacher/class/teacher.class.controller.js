const autoBind = require('auto-bind')
const { TeacherClassMessages } = require('./teacher.class.messages')
const { TeacherClassService } = require('./teacher.class.service')
const { unlinkSync } = require('fs')

class TeacherClassController {
    #service

    constructor() {
        autoBind(this)
        this.#service = TeacherClassService
    }

    async assign(req, res, next) {
        try {
            const validationErrors = await this.#service.validateBulkCreateExcelFile(req)

            const filePath = req?.file?.path.replace(/\\/g, '/').substring(7)
            const fileUrl = req.protocol + '://' + req.get('host') + '/' + filePath

            if (validationErrors.length >= 1) {
                // remove excel file from server
                unlinkSync(req.file.path)

                return res.status(400).json({
                    code: 400,
                    message: TeacherClassMessages.ValidationError,
                    errors: validationErrors[0],
                })
            }

            await this.#service.bulkAssign(req.body, req.user, fileUrl)

            return res.status(200).json({
                message: TeacherClassMessages.AssignRequestSuccessfully,
                code: 200,
            })
        } catch (error) {
            unlinkSync(req.file.path)
            next(error)
        }
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
            const userId = req.user.userId

            const result = await this.#service.getAll(userId)

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
