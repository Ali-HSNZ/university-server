const { body } = require('express-validator')

const adminCreateTeacherValidator = () => {
    const phoneNumberRegex = /^(\+98?)?{?(0?9[0-9]{9,9}}?)$/
    const persianRegex = /^[\u0600-\u06FF\s]+$/
    const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/
    const onlyDigits = /^\d+$/

    return [
        body('first_name')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('نام الزامی می‌باشد')
            .isLength({ min: 3, max: 20 })
            .withMessage('نام نمی‌تواند کم از 3 نویسه و بیشتر از 20 نویسه باشد')
            .matches(persianRegex)
            .withMessage('نام معتبر نیست'),
        body('last_name')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('نام خانوادگی الزامی می‌باشد')
            .isLength({ min: 3, max: 50 })
            .withMessage('نام نمی‌تواند کم از 3 نویسه و بیشتر از 50 نویسه باشد')
            .matches(persianRegex)
            .withMessage('نام خانوادگی معتبر نیست'),
        body('national_code')
            .notEmpty()
            .withMessage('کدملی الزامی می‌باشد')
            .matches(onlyDigits)
            .withMessage('کدملی معتبر نیست')
            .isLength({ max: 10 })
            .withMessage('کدملی معتبر نیست'),
        body('mobile')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('شماره موبایل الزامی می‌باشد')
            .matches(phoneNumberRegex)
            .withMessage('شماره موبایل معتبر نیست'),
        body('birthDay')
            .notEmpty()
            .withMessage('تاریخ تولد الزامی می‌باشد')
            .isString()
            .withMessage('تاریخ تولد معتبر نیست'),
        body('gender')
            .notEmpty()
            .withMessage('جنسیت الزامی می‌باشد')
            .isLength({ max: 3 })
            .withMessage('جنسیت معتبر نیست')
            .matches(persianRegex)
            .withMessage('جنسیت معتبر نیست'),
        body('education')
            .notEmpty()
            .withMessage('مدرک تحصیلی الزامی نمی‌باشد')
            .isLength({ max: 50 })
            .withMessage('مدرک تحصیلی معتبر نیست')
            .matches(persianRegex)
            .withMessage('مدرک تحصیلی معتبر نیست'),
        body('address')
            .trim()
            .notEmpty()
            .withMessage('آدرس الزامی می‌باشد')
            .isLength({ min: 3, max: 300 })
            .withMessage('آدرس نمی‌تواند کم تر از 3 نویسه و بیشتر از 300 نویسه باشد')
            .matches(persianTextAndEnglishNumberRegex)
            .withMessage('آدرس معتبر نیست'),
    ]
}

const adminUpdateTeacherValidator = () => {
    const phoneNumberRegex = /^(\+98?)?{?(0?9[0-9]{9,9}}?)$/
    const persianRegex = /^[\u0600-\u06FF\s]+$/
    const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/
    const onlyDigits = /^\d+$/

    return [
        body('first_name')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('نام الزامی می‌باشد')
            .isLength({ min: 3, max: 20 })
            .withMessage('نام نمی‌تواند کم از 3 نویسه و بیشتر از 20 نویسه باشد')
            .matches(persianRegex)
            .withMessage('نام معتبر نیست'),
        body('last_name')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('نام خانوادگی الزامی می‌باشد')
            .isLength({ min: 3, max: 50 })
            .withMessage('نام نمی‌تواند کم از 3 نویسه و بیشتر از 50 نویسه باشد')
            .matches(persianRegex)
            .withMessage('نام خانوادگی معتبر نیست'),
        body('national_code')
            .notEmpty()
            .withMessage('کدملی الزامی می‌باشد')
            .matches(onlyDigits)
            .withMessage('کدملی معتبر نیست')
            .isLength({ max: 10 })
            .withMessage('کدملی معتبر نیست'),
        body('mobile')
            .trim()
            .isString()
            .notEmpty()
            .withMessage('شماره موبایل الزامی می‌باشد')
            .matches(phoneNumberRegex)
            .withMessage('شماره موبایل معتبر نیست'),
        body('gender')
            .notEmpty()
            .withMessage('جنسیت الزامی می‌باشد')
            .isLength({ max: 3 })
            .withMessage('جنسیت معتبر نیست')
            .matches(persianRegex)
            .withMessage('جنسیت معتبر نیست'),
        body('education')
            .notEmpty()
            .withMessage('مدرک تحصیلی الزامی نمی‌باشد')
            .isLength({ max: 50 })
            .withMessage('مدرک تحصیلی معتبر نیست')
            .matches(persianRegex)
            .withMessage('مدرک تحصیلی معتبر نیست'),
        body('address')
            .trim()
            .notEmpty()
            .withMessage('آدرس الزامی می‌باشد')
            .isLength({ min: 3, max: 300 })
            .withMessage('آدرس نمی‌تواند کم تر از 3 نویسه و بیشتر از 300 نویسه باشد')
            .matches(persianTextAndEnglishNumberRegex)
            .withMessage('آدرس معتبر نیست'),
    ]
}

module.exports = {
    adminCreateTeacherValidator,
    adminUpdateTeacherValidator,
}
