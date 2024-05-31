const autoBind = require('auto-bind')
const adminTeacherQueries = require('./admin.teacher.queries')
const { AdminTeacherMessages } = require('./admin.teacher.messages')
const { generateUniqueCode } = require('../../../common/utils/generate-unique-code')
const { getDayByCode } = require('../../../common/utils/get-day-by-code')
const { mapLabelsToValues } = require('../../../common/utils/map-labels-to-values')
const { adminCreateTeacherExcelValidator } = require('./admin.teacher.validation')
const createHttpError = require('http-errors')
const { getDayCode } = require('../../../common/utils/get-code-by-day')

class AdminTeacherService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = adminTeacherQueries
    }
    async deleteFileByFileId(fileId) {
        return await this.#queries.deleteFileByFileId(fileId)
    }
    async createUniqCode() {
        let teacherCode = generateUniqueCode()
        let isUnique = false

        // check uniq code
        while (!isUnique) {
            teacherCode = generateUniqueCode()
            const existingRecord = await this.#queries.isExistTeacherByCode(teacherCode)
            if (existingRecord.recordset.length === 0) {
                isUnique = true
            }
        }
        return teacherCode
    }

    async create(teacherDTO) {
        // all req.body data
        const {
            first_name,
            last_name,
            national_code,
            mobile,
            birthDay,
            gender,
            education,
            address,
        } = teacherDTO

        // check uniq code
        const teacherCode = await this.createUniqCode()

        // insert teacher DB query
        await this.#queries.create({
            first_name,
            last_name,
            national_code,
            mobile,
            birthDay,
            gender,
            education,
            address,
            teacherCode,
        })
    }

    async createTeacherFile(user, fileUrl) {
        const currentDate = new Date()

        const createFileDate =
            currentDate.toLocaleDateString('fa-IR') +
            ' | ' +
            currentDate.toLocaleTimeString('fa-IR')

        await this.#queries.createTeacherFile({
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.type,
            section: 'استاد',
            file_path: fileUrl,
            is_show: 1,
            date: createFileDate,
            userId: user.userId,
        })
    }

    async bulkCreate(usersList, user, fileUrl) {
        const usersDTO = this.convertExcelToValidData(usersList)

        // check user not exist
        for (const user of usersDTO) {
            const isExistTeacher = await this.checkExistUser(user.national_code, user.mobile)
            if (isExistTeacher) {
                if (isExistTeacher['national_code'])
                    throw new createHttpError.BadRequest('کد ملی تکراری است')
                else throw new createHttpError.BadRequest('شماره موبایل تکراری است')
            }
        }

        for (const user of usersDTO) {
            await this.create({
                first_name: user.first_name,
                last_name: user.last_name,
                national_code: user.national_code,
                mobile: user.mobile,
                birthDay: user.birthDay,
                gender: user.gender,
                education: user.education,
                address: user.address,
            })
        }

        await this.createTeacherFile(user, fileUrl)
    }

    async validateBulkCreateExcelFile(req) {
        const errors = await Promise.all(
            adminCreateTeacherExcelValidator.map((validation) => validation.run(req))
        )

        const errorMap = new Map()

        errors.forEach((e) =>
            e.errors.forEach((err) => {
                if (errorMap.has(err.msg)) {
                    const entry = errorMap.get(err.msg)
                    const index = Number(err.path.match(/\d+/)[0]) + 1
                    entry.path += ` , ${index}`
                } else {
                    const index = Number(err.path.match(/\d+/)[0]) + 1
                    errorMap.set(err.msg, {
                        message: err.msg,
                        path: `ردیف ${Number(index)}`,
                    })
                }
            })
        )

        const validationErrors = Array.from(errorMap.values()).filter(
            (err) => err.message !== 'Invalid value'
        )
        return validationErrors
    }

    convertExcelToValidData(data) {
        const columns = [
            { value: 'first_name', label: 'نام' },
            { value: 'last_name', label: 'نام خانوادگی' },
            { value: 'national_code', label: 'کد ملی' },
            { value: 'mobile', label: 'شماره موبایل' },
            { value: 'birthDay', label: 'تاریخ تولد' },
            { value: 'gender', label: 'جنسیت' },
            { value: 'education', label: 'مدرک تحصیلی' },
            { value: 'address', label: 'آدرس' },
        ]

        return mapLabelsToValues(data, columns)
    }

    async getAllFiles() {
        const result = await this.#queries.getAllFiles()
        return result.recordset
    }

    async update(teacherDTO, id) {
        // all req.body data
        const { first_name, pass, last_name, national_code, mobile, gender, education, address } =
            teacherDTO

        const result = await this.#queries.update({
            first_name,
            last_name,
            national_code,
            mobile,
            gender,
            education,
            address,
            id,
            pass,
        })

        return result
    }

    async checkExistUser(national_code, mobile) {
        // exist national_code DB query
        const availableNationalCode =
            await this.#queries.isExistTeacherByNational_code(national_code)

        // check exist national_code => this template like validation error
        if (availableNationalCode.recordset.length > 0)
            return { ['national_code']: AdminTeacherMessages.ExistNationalCode }

        // exist mobile DB query
        const availableMobile = await this.#queries.isExistTeacherByMobile(mobile)

        // check exist mobile => this template like validation error
        if (availableMobile.recordset.length > 0)
            return { ['mobile']: AdminTeacherMessages.ExistMobile }

        return false
    }

    async allTeachers() {
        // get teachers along with class_count DB query
        return await this.#queries.allTeacher()
    }

    async deleteTeacherByCode(teacherCode) {
        const availableUser = await this.#queries.getTeacherByCode(teacherCode)

        if (availableUser.recordset.length === 0) {
            throw new createHttpError.NotFound(AdminTeacherMessages.TeacherNotFound)
        }

        const { userId } = availableUser.recordset[0]

        return await this.#queries.deleteTeacherById(userId)
    }

    async teacherClassList(teacherCode) {
        const availableUser = await this.#queries.getTeacherByCode(teacherCode)

        if (availableUser.recordset.length === 0) {
            throw new createHttpError.NotFound(AdminTeacherMessages.TeacherNotFound)
        }
        const { userId } = availableUser.recordset[0]

        const classesList = await this.#queries.teacherClassList(userId)
        const teacher = await this.#queries.getProfile(userId)

        return {
            classes: classesList.recordset,
            teacher: teacher.recordset[0],
        }
    }

    async deleteClassByTeacherCode(teacherCode, classId) {
        const availableUser = await this.#queries.getTeacherByCode(teacherCode)

        if (availableUser.recordset.length === 0) {
            throw new createHttpError.NotFound(AdminTeacherMessages.TeacherNotFound)
        }

        const { userId } = availableUser.recordset[0]

        return await this.#queries.deleteClassByTeacherCode(userId, classId)
    }

    async getProfile(teacherCode) {
        const availableUser = await this.#queries.getTeacherByCode(teacherCode)

        if (availableUser.recordset.length === 0) {
            throw new createHttpError.NotFound(AdminTeacherMessages.TeacherNotFound)
        }

        const { userId } = availableUser.recordset[0]
        const result = await this.#queries.getProfile(userId)
        return result.recordset[0]
    }

    // title
    async assignmentClassTitleList() {
        const result = await this.#queries.assignmentClassTitleList()
        return result.recordset.map((e) => ({ ...e, value: e.value.toString() }))
    }

    // day
    async assignmentClassDayList(lessonId) {
        const result = await this.#queries.assignmentClassDayList(lessonId)

        const formatter = result.recordset.map((e) => ({
            label: e.day,
            value: getDayCode(e.day),
        }))

        return formatter
    }
    // time
    async assignmentClassTimeList({ lessonId, dayId }) {
        const day = getDayByCode(dayId)
        const result = await this.#queries.assignmentClassTimeList({ lessonId, day })

        const formatter = result.recordset.map((e, index) => ({
            label: `از ساعت ${e.start_time} تا ${e.end_time}`,
            value: (index + 1).toString(),
        }))

        return formatter
    }

    // test
    async assignmentClassTest({ lessonId, dayId, start_time }) {
        const day = getDayByCode(dayId)
        const result = await this.#queries.assignmentClassTest({
            lessonId,
            day,
            start_time,
        })
        return result.recordset[0]
    }

    async assignmentClassToTeacher({ teacherCode, classId, dayCode, start_time }) {
        const day = getDayByCode(dayCode)

        const availableUser = await this.#queries.getTeacherByCode(teacherCode)

        if (availableUser.recordset.length === 0) {
            throw new createHttpError.NotFound(AdminTeacherMessages.TeacherNotFound)
        }

        const { userId } = availableUser.recordset[0]

        const result = await this.#queries.assignmentClassToTeacher({
            classId,
            day,
            start_time,
            userId,
        })

        return result.recordset
    }
}

module.exports = {
    adminTeacherService: new AdminTeacherService(),
}
