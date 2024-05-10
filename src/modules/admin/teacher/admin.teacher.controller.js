const autoBind = require('auto-bind')
const { adminTeacherService } = require('./admin.teacher.service')
const { AdminTeacherMessages } = require('./admin.teacher.messages')

class AdminTeacherController {
    #service

    constructor() {
        autoBind(this)
        this.#service = adminTeacherService
    }

    async create(req, res, next) {
        try {
            // req Body Data
            const userDTO = req.body

            // check exist user with national_code and mobile
            const availableUser = await this.#service.checkExistUser(
                userDTO.national_code,
                userDTO.mobile
            )

            // send exist error
            if (availableUser)
                return res.status(400).json({
                    code: 400,
                    errors: availableUser,
                })

            // create teacher via userDTO
            await this.#service.create(userDTO)

            // send successfully response
            res.status(201).json({
                code: 201,
                message: AdminTeacherMessages.CreateTeacherSuccessfully,
            })
        } catch (error) {
            next(error)
        }
    }

    async allTeachers(req, res, next) {
        try {
            const teachers = await this.#service.allTeachers()
            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.TeacherListSuccessfully,
                data: teachers.recordset,
            })
        } catch (error) {
            next(error)
        }
    }

    async editProfile() {}
    async assignmentClass() {}
    async assignmentClass() {}
    async deleteClass() {}
}

module.exports = {
    adminTeacherController: new AdminTeacherController(),
}
