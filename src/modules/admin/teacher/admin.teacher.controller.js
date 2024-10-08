const autoBind = require('auto-bind')
const { adminTeacherService } = require('./admin.teacher.service')
const { AdminTeacherMessages } = require('./admin.teacher.messages')
const { unlinkSync } = require('fs')
const createHttpError = require('http-errors')
const { findFile } = require('../../../common/utils/find-file')

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

    async allFiles(req, res, next) {
        try {
            const result = await this.#service.getAllFiles()
            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.TeachersFiles,
                data: result,
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
            const teacherCode = req.params.teacherCode
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

            if (result.rowsAffected.length >= 1)
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
            const { dayCode, start_time, classId, user_code } = req.body

            await this.#service.assignmentClassToTeacher({
                teacherCode: user_code,
                classId,
                dayCode,
                start_time,
            })

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.TeacherAssignSuccessfully,
            })
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
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    async assignmentClassDayList(req, res, next) {
        try {
            const result = await this.#service.assignmentClassDayList(req.params.id)

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.AssignmentClassDayList,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    async assignmentClassTimeList(req, res, next) {
        try {
            const { lessonId, dayId } = req.params
            const result = await this.#service.assignmentClassTimeList({ lessonId, dayId })

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.AssignmentClassTimeList,
                data: result,
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

    async deleteFile(req, res, next) {
        try {
            const { fileId, fileName } = req.params
            const filePath = findFile(fileName)

            const result = await this.#service.deleteFileByFileId(fileId)
            if (result.rowsAffected.length === 0) {
                throw new createHttpError.NotFound(AdminTeacherMessages.DeleteFileFailed)
            }

            unlinkSync(filePath)

            res.status(200).json({
                code: 200,
                message: AdminTeacherMessages.DeleteFileSuccessfully,
            })
        } catch (error) {
            next(error)
        }
    }

    async bulkCreate(req, res, next) {
        try {
            const validationErrors = await this.#service.validateBulkCreateExcelFile(req)

            const filePath = req?.file?.path.replace(/\\/g, '/').substring(7)
            const fileUrl = req.protocol + '://' + req.get('host') + '/' + filePath

            if (validationErrors.length >= 1) {
                // remove excel file from server
                unlinkSync(req.file.path)

                return res.status(400).json({
                    code: 400,
                    message: AdminTeacherMessages.ValidationError,
                    errors: validationErrors[0],
                })
            }

            await this.#service.bulkCreate(req.body, req.user, fileUrl)

            return res.status(200).json({
                message: AdminTeacherMessages.CreateTeacherSuccessfully,
                code: 200,
            })
        } catch (error) {
            unlinkSync(req.file.path)
            next(error)
        }
    }

    async teacherProfile(req, res, next) {
        try {
            const teacherCode = req.params.teacherCode

            const result = await this.#service.getProfile(teacherCode)

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
