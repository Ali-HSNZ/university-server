const { body } = require('express-validator')

const adminCreateClassValidator = () => {
    const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/

    const timeRegex = /^\d{2}:\d{2}$/
    const onlyDigits = /^\d+$/

    return [
        body('lesson_id')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('نام درس الزامی می‌باشد')
            .withMessage('نام درس نمی‌تواند کم تر از 2 و بیشتر از 50 نویسه باشد')
            .matches(onlyDigits)
            .withMessage('شناسه درس معتبر نیست'),
        body('end_time').trim().notEmpty().withMessage('ساعت پایان کلاس الزامی می‌باشد'),
        body('start_time').trim().notEmpty().withMessage('ساعت شروع کلاس الزامی می‌باشد'),
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
module.exports = { adminCreateClassValidator }
