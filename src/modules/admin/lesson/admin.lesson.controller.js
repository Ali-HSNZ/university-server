const autoBind = require('auto-bind')
const { AdminLessonService } = require('./admin.lesson.service')
const { AdminLessonMessages } = require('./admin.lesson.messages')
const { unlinkSync } = require('fs')
const { findFile } = require('../../../common/utils/find-file')
const createHttpError = require('http-errors')

class AdminLessonController {
    #service
    constructor() {
        autoBind(this)
        this.#service = AdminLessonService
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
                    message: AdminLessonMessages.ValidationError,
                    errors: validationErrors[0],
                })
            }
            await this.#service.bulkCreate(req.body, req.user, fileUrl)

            return res.status(200).json({
                message: AdminLessonMessages.CreateLessonSuccessfully,
                code: 200,
            })
        } catch (error) {
            unlinkSync(req.file.path)
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const lessonDTO = req.body

            const availableLesson = await this.#service.checkExistLessonByTitle(lessonDTO.title)
            if (availableLesson)
                return res.status(400).json({
                    code: 400,
                    errors: availableLesson,
                    message: AdminLessonMessages.ExistLessonTitle,
                })

            await this.#service.create(lessonDTO)

            res.status(201).json({
                code: 201,
                message: AdminLessonMessages.CreateLessonSuccessfully,
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
                message: AdminLessonMessages.LessonsFiles,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }
    async list(req, res, next) {
        try {
            const result = await this.#service.getAll()
            res.status(200).json({
                code: 200,
                message: AdminLessonMessages.AllLessons,
                data: result,
            })
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
                throw new createHttpError.InternalServerError(AdminLessonMessages.DeleteFileFailed)
            }

            unlinkSync(filePath)

            res.status(200).json({
                code: 200,
                message: AdminLessonMessages.DeleteFileSuccessfully,
            })
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.params.id

            const result = await this.#service.deleteLessonById(id)

            if (result.rowsAffected.length >= 1)
                return res.status(200).json({
                    code: 200,
                    message: AdminLessonMessages.DeleteLessonSuccessfully,
                })

            throw {
                code: 500,
                message: AdminLessonMessages.DeleteLessonFailed,
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    AdminLessonController: new AdminLessonController(),
}
