const { check } = require('express-validator')

const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/

const teacherCreateClassExcelValidator = [
    check('*.نام درس')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('نام درس الزامی می‌باشد')
        .matches(persianTextAndEnglishNumberRegex)
        .withMessage('نام درس معتبر نیست'),
    check('*.ساعت شروع کلاس').trim().notEmpty().withMessage('ساعت شروع کلاس الزامی می‌باشد'),
    check('*.ساعت پایان کلاس').trim().notEmpty().withMessage('ساعت پایان کلاس الزامی می‌باشد'),
    check('*.روز برگزاری کلاس')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('روز برگزاری کلاس معتبر نمی‌باشد')
        .isIn(['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'])
        .withMessage('روز برگزاری کلاس معتبر نمی‌باشد'),
]
module.exports = { teacherCreateClassExcelValidator }
