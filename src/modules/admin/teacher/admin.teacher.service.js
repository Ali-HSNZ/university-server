const autoBind = require('auto-bind')
const adminTeacherQueries = require('./admin.teacher.queries')
const { AdminTeacherMessages } = require('./admin.teacher.messages')
const { generateUniqueCode } = require('../../../utils/generate-unique-code')
class AdminTeacherService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = adminTeacherQueries
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

        // insert teacher DB query
        const result = await this.#queries.create({
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

    async deleteTeacherByCode(code) {
        return await this.#queries.deleteTeacherByCode(code)
    }

    async teacherClassList(teacherCode) {
        const classesList = (await this.#queries.teacherClassList(teacherCode)).recordset
        const teacher = (await this.#queries.isExistTeacherByCode(teacherCode)).recordset[0]

        return {
            classes: classesList,
            teacher,
        }
    }

    async deleteClassByTeacherCode(teacherCode, classId) {
        return await this.#queries.deleteClassByTeacherCode(teacherCode, classId)
    }
}

module.exports = {
    adminTeacherService: new AdminTeacherService(),
}
