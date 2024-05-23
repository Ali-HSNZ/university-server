const { body, check } = require('express-validator')

const onlyDigits = /^\d+$/
const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/

const adminCreateClassValidator = () => {
    return [
        body('lesson_id')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('نام درس الزامی می‌باشد')
            .matches(onlyDigits)
            .withMessage('شناسه درس معتبر نیست'),
        body('start_time').trim().notEmpty().withMessage('ساعت شروع کلاس الزامی می‌باشد'),
        body('end_time').trim().notEmpty().withMessage('ساعت پایان کلاس الزامی می‌باشد'),
        body('day')
            .trim()
            .isLength({ min: 2, max: 20 })
            .withMessage('روز برگزاری کلاس معتبر نمی‌باشد'),
        body('test_date').trim().isLength({ max: 50 }).withMessage('تاریخ معتبر نمی‌باشد'),
        body('test_time')
            .trim()
            .isLength({ max: 50 })
            .withMessage('ساعت برگزاری آزمون الزامی می‌باشد'),
    ]
}

const adminCreateClassExcelValidator = [
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
        .isIn(['شنبه', 'یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه'])
        .withMessage('روز برگزاری کلاس معتبر نمی‌باشد'),
    check('*.تاریخ آزمون')
        .trim()
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('تاریخ معتبر نمی‌باشد'),

    check('*.ساعت برگزاری آزمون')
        .trim()
        .isLength({ max: 50 })
        .withMessage('ساعت برگزاری آزمون الزامی می‌باشد'),
]
module.exports = { adminCreateClassValidator, adminCreateClassExcelValidator }
