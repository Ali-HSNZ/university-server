const { body } = require('express-validator')

const authValidator = () => {
    return [
        body('national_code')
            .notEmpty()
            .withMessage('کدملی الزامی می‌باشد')
            .matches(/^\d+$/)
            .withMessage('کدملی معتبر نمی‌باشد'),
        body('pass')
            .notEmpty()
            .withMessage('رمزعبور الزامی می‌باشد')
            .isLength({ min: 1, max: 50 })
            .withMessage('رمزعبور معتبر نمی‌باشد'),
    ]
}

module.exports = {
    authValidator,
}
