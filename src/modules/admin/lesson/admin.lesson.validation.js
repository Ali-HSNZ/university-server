const { body, check } = require('express-validator')

const adminCreateLessonValidator = () => {
    const persianRegex = /^[\u0600-\u06FF\s]+$/
    const persianTextAndEnglishNumberRegex = /^[\u0600-\u06FF\s0-9]+$/

    const onlyDigits = /^\d+$/

    return [
        body('title')
            .isString()
            .trim()
            .notEmpty()
            .withMessage('عنوان درس الزامی می‌باشد')
            .isLength({ min: 2, max: 50 })
            .withMessage('نام درس نمی تواند کم تر از 2 و بیشتر از 50 نویسه باشد')
            .matches(persianTextAndEnglishNumberRegex)
            .withMessage('نام درس معتبر نیست'),
        body('type')
            .isString()
            .trim()
            .withMessage('نوع درس الزامی می‌باشد')
            .isLength({ min: 3, max: 100 })
            .withMessage('نوع درس نمی تواند کم تر 3 و بیشتر از 100 نویسه باشد')
            .notEmpty()
            .matches(persianRegex)
            .withMessage('نوع درس معتبر نمی‌باشد'),
        body('theory_unit').custom((value, { req }) => {
            const validUnit = 3

            if (!onlyDigits.test(value)) throw 'واحد تئوری معتبر نمی‌باشد'

            if (!value && +value !== 0) throw 'واحد تئوری الزامی می‌باشد'

            const practical_unit = req.body?.practical_unit

            if (value > validUnit) throw `واحد تئوری نمی تواند بیشتر از ${validUnit} واحد باشد`

            if (practical_unit > validUnit - value) {
                throw `جمع واحد تئوری و عملی نمی تواند بیشتر از ${validUnit} واحد باشد`
            }

            if (+practical_unit === 0 && +value === 0)
                throw 'جمع واحد تئوری و عملی باید 1 یا بیشتر از 1 باشد'
            return true
        }),
        body('practical_unit')
            .notEmpty()
            .withMessage('واحد عملی الزامی می‌باشد')
            .matches(onlyDigits)
            .withMessage('واحد عملی معتبر نمی‌باشد'),
    ]
}
module.exports = { adminCreateLessonValidator }
