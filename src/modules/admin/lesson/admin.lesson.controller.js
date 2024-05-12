const autoBind = require('auto-bind')
const adminLessonService = require('./admin.lesson.service')
const { AdminLessonMessages } = require('./admin.lesson.messages')

class AdminLessonController {
    #service
    constructor() {
        autoBind(this)
        this.#service = adminLessonService.AdminLessonService
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
    async delete(req, res, next) {
        try {
            const id = req.params.id

            const result = await this.#service.deleteLessonById(id)

            if (result.rowsAffected[0] >= 1)
                return res.status(200).json({
                    code: 200,
                    message: AdminLessonMessages.DeleteLessonSuccessfully,
                    result,
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
