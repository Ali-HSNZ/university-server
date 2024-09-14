const autoBind = require('auto-bind')
const { AdminClassService } = require('./admin.class.service')
const { AdminClassMessages } = require('./admin.class.messages')
const { unlinkSync } = require('fs')
const { findFile } = require('../../../common/utils/find-file')
const createHttpError = require('http-errors')
class AdminClassController {
    #service

    constructor() {
        autoBind(this)
        this.#service = AdminClassService
    }

    async assignClassByFileName(req, res, next) {
        try {
            await this.#service.assignClassByFileName(req.params.fileName, req.params.fileId)
            res.status(200).json({
                code: 200,
                message: AdminClassMessages.AssignClassByFile,
            })
        } catch (error) {
            next(error)
        }
    }

    async lessonsList(req, res, next) {
        try {
            const result = await this.#service.lessonsList()
            res.status(200).json({
                code: 200,
                message: AdminClassMessages.ClassValidLessons,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const { lesson_id, day, start_time } = req.body

            const lesson = await this.#service.getLessonTitleById(lesson_id)

            const availableLesson = await this.#service.checkExistLesson({
                lesson_id,
                day,
                start_time,
            })

            if (availableLesson.length > 0) {
                const errorMessage = `درس ${lesson.title} در ساعت ${start_time} در روز ${day} تشکیل می‌شود`
                return res.status(400).json({
                    code: 400,
                    errors: { ['lesson_id']: errorMessage },
                    message: errorMessage,
                })
            }

            if (!availableLesson) {
                return res.status(400).json({
                    code: 400,
                    errors: { ['title']: AdminClassMessages.LessonNotAvailable },
                    message: AdminClassMessages.LessonNotAvailable,
                })
            }

            await this.#service.create({
                ...req.body,
                lesson_id: req.body.lesson_id,
                title: lesson.title,
            })

            res.status(201).json({ code: 201, message: AdminClassMessages.CreateClassSuccessfully })
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
                    message: 'خطای اعتبارسنجی',
                    errors: validationErrors[0],
                })
            }

            await this.#service.bulkCreate(req.body, req.user, fileUrl)

            return res.status(200).json({
                message: AdminClassMessages.BulkCreateSuccessfully,
                code: 200,
            })
        } catch (error) {
            unlinkSync(req.file.path)
            next(error)
        }
    }

    async allFiles(req, res, next) {
        try {
            const result = await this.#service.getAllFiles()
            res.status(200).json({
                code: 200,
                message: AdminClassMessages.LessonsFiles,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteClassById(req, res, next) {
        try {
            const id = req.params.id

            const result = await this.#service.deleteClassById(id)

            if (result.rowsAffected[0] >= 1)
                return res.status(200).json({
                    code: 200,
                    message: AdminClassMessages.ClassDeletedSuccessfully,
                })

            throw {
                code: 500,
                message: AdminClassMessages.ClassDeletedFailed,
            }
        } catch (error) {
            next(error)
        }
    }
    async pendingToAgreeList(req, res, next) {
        try {
            const result = await this.#service.getPendingToAgreeList()
            res.status(200).json({
                code: 200,
                message: AdminClassMessages.PendingToAgreeList,
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const result = await this.#service.getAll()

            res.status(200).json({
                code: 200,
                message: AdminClassMessages.ClassList,
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
                throw new createHttpError.NotFound('خطا در فرایند حذف فایل')
            }

            unlinkSync(filePath)

            res.status(200).json({
                code: 200,
                message: AdminClassMessages.DeleteFileSuccessfully,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    AdminClassController: new AdminClassController(),
}
