const autoBind = require('auto-bind')
const { adminTeacherService } = require('./admin.teacher.service')
const { AdminTeacherMessages } = require('./admin.teacher.messages')
const { getDayCode } = require('../../../utils/get-code-by-day')

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

    async update(req, res, next) {
        try {
            const id = req.params.id

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

            // update teacher via userDTO
            await this.#service.update(userDTO, id)

            // send successfully response
            res.status(201).json({
                code: 201,
                message: AdminTeacherMessages.UpdateTeacherSuccessfully,
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

    async classList(req, res, next) {
        try {
            const teacherCode = req.params.id
            const result = await this.#service.teacherClassList(teacherCode)
            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.TeacherClassesListSuccessfully,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }
    async deleteClass(req, res, next) {
        try {
            const { teacherCode, classId } = req.params

            const result = await this.#service.deleteClassByTeacherCode(teacherCode, classId)

            if (result.rowsAffected[0] >= 1)
                return res.status(200).json({
                    code: 200,
                    message: AdminTeacherMessages.TeacherClassDeletedSuccessfully,
                    result,
                })

            throw {
                code: 500,
                message: AdminTeacherMessages.TeacherClassDeletedFailed,
            }
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const teacherCode = req.params.teacherCode
            const result = await this.#service.deleteTeacherByCode(teacherCode)

            if (result.rowsAffected[0] >= 1)
                return res.status(200).json({
                    code: 200,
                    message: AdminTeacherMessages.DeleteTeacherSuccessfully,
                    result,
                })

            throw {
                code: 500,
                message: AdminTeacherMessages.DeleteTeacherFailed,
            }
        } catch (error) {
            next(error)
        }
    }

    async createAssignmentClass(req, res, next) {
        try {
            const { userId, user_code, classId, dayCode, start_time } = req.body
            const result = await this.#service.assignmentClassToTeacher({
                userId,
                user_code,
                classId,
                dayCode,
                start_time,
            })
            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    async assignmentClassTitleList(req, res, next) {
        try {
            const result = await this.#service.assignmentClassTitleList()
            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.AssignmentClassTitleList,
                data: result.map((e) => ({ ...e, value: e.value.toString() })),
            })
        } catch (error) {
            next(error)
        }
    }

    async assignmentClassDayList(req, res, next) {
        try {
            const lessonId = req.params.id

            const result = await this.#service.assignmentClassDayList(lessonId)

            const formatter = result.map((e, index) => ({
                label: e.day,
                value: getDayCode(e.day),
            }))

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.AssignmentClassDayList,
                data: formatter,
            })
        } catch (error) {
            next(error)
        }
    }

    async assignmentClassTimeList(req, res, next) {
        try {
            const { lessonId, dayId } = req.params
            const result = await this.#service.assignmentClassTimeList({ lessonId, dayId })

            const formatter = result.map((e, index) => ({
                label: `از ساعت ${e.start_time} تا ${e.end_time}`,
                value: (index + 1).toString(),
            }))

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.AssignmentClassTimeList,
                data: formatter,
            })
        } catch (error) {
            next(error)
        }
    }

    async assignmentClassTest(req, res, next) {
        try {
            const { lessonId, dayId, start_time } = req.params
            const result = await this.#service.assignmentClassTest({
                lessonId,
                dayId,
                start_time,
            })
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async teacherProfile(req, res, next) {
        try {
            const id = req.params.id
            const result = await this.#service.getProfile(id)

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.TeacherProfile,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    adminTeacherController: new AdminTeacherController(),
}
