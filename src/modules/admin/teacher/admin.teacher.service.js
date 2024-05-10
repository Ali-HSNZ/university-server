const autoBind = require('auto-bind')
const adminTeacherQueries = require('./admin.teacher.queries')
const { AdminTeacherMessages } = require('./admin.teacher.messages')
const { hashString } = require('../../../utils/hash-string')
const { v4: uuidv4 } = require('uuid')
class AdminTeacherService {
    #queries
    constructor() {
        autoBind(this)
        this.#queries = adminTeacherQueries
    }

    async create(teacherDTO) {
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

        const teacherCode = (
            uuidv4().match(/-(\w+-\w+)/)[0] + uuidv4().match(/-(\w+-\w+)/)[1]
        ).replaceAll(/-/g, '')

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
}

module.exports = {
    adminTeacherService: new AdminTeacherService(),
}
