const autoBind = require('auto-bind')
const { AdminClassService } = require('./admin.class.service')
const { AdminLessonService } = require('../lesson/admin.lesson.service')
const { AdminClassMessages } = require('./admin.class.messages')

class AdminClassController {
    #service
    constructor() {
        autoBind(this)
        this.#service = AdminClassService
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
}

module.exports = {
    AdminClassController: new AdminClassController(),
}
