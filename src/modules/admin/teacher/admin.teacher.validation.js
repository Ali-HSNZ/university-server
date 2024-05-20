const { body, check } = require('express-validator')

const phoneNumberRegex = /^(\+98?)?{?(0?9[0-9]{9,9}}?)$/
const persianRegex = /^[\u0600-\u06FF\s]+$/
const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/
const onlyDigits = /^\d+$/
const birthDayRegex = /^(13[0-9]{2})\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/

// Create
const adminCreateTeacherValidator = () => {
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

// Update
const adminUpdateTeacherValidator = () => {
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

// Excel Validation
const adminCreateTeacherExcelValidator = [
    check('*.نام')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('نام الزامی می‌باشد')
        .isLength({ min: 3, max: 20 })
        .withMessage('نام نمی‌تواند کم از 3 نویسه و بیشتر از 20 نویسه باشد')
        .matches(persianRegex)
        .withMessage('نام معتبر نیست'),
    check('*.نام خانوادگی')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('نام خانوادگی الزامی می‌باشد')
        .isLength({ min: 3, max: 50 })
        .withMessage('نام نمی‌تواند کم از 3 نویسه و بیشتر از 50 نویسه باشد')
        .matches(persianRegex)
        .withMessage('نام خانوادگی معتبر نیست'),
    check('*.کد ملی')
        .notEmpty()
        .withMessage('کدملی الزامی می‌باشد')
        .matches(onlyDigits)
        .withMessage('کدملی معتبر نیست')
        .isLength({ max: 10 })
        .withMessage('کدملی معتبر نیست'),
    check('*.شماره موبایل')
        .trim()
        .isString()
        .notEmpty()
        .withMessage('شماره موبایل الزامی می‌باشد')
        .matches(phoneNumberRegex)
        .withMessage('شماره موبایل معتبر نیست'),
    check('*.تاریخ تولد')
        .notEmpty()
        .withMessage('تاریخ تولد الزامی می‌باشد')
        .isString()
        .withMessage('تاریخ تولد شسزشسشسز نیست')
        .matches(birthDayRegex)
        .withMessage('تاریخ تولد معتبر نیست'),
    check('*.جنسیت')
        .notEmpty()
        .withMessage('جنسیت الزامی می‌باشد')
        .isLength({ max: 3 })
        .withMessage('جنسیت معتبر نیست')
        .matches(persianRegex)
        .isIn(['مرد', 'زن'])
        .withMessage('جنسیت معتبر نیست'),
    check('*.مدرک تحصیلی')
        .notEmpty()
        .withMessage('مدرک تحصیلی الزامی نمی‌باشد')
        .isLength({ max: 50 })
        .isIn(['کاردانی', 'کارشناسی', 'کارشناسی ارشد', 'دکترا', 'فوق دکترا'])
        .withMessage('مدرک تحصیلی معتبر نیست')
        .matches(persianRegex)
        .withMessage('مدرک تحصیلی معتبر نیست'),
    check('*.آدرس')
        .trim()
        .notEmpty()
        .withMessage('آدرس الزامی می‌باشد')
        .isLength({ min: 3, max: 300 })
        .withMessage('آدرس نمی‌تواند کم تر از 3 نویسه و بیشتر از 300 نویسه باشد')
        .matches(persianTextAndEnglishNumberRegex)
        .withMessage('آدرس معتبر نیست'),
]

module.exports = {
    adminCreateTeacherValidator,
    adminUpdateTeacherValidator,
    adminCreateTeacherExcelValidator,
}
