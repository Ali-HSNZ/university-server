const AuthorizationMessage = require('./authorization.message')

const CheckAdminAccessibility = async (req, res, next) => {
    try {
        if (req.user.type !== 1) {
            res.status(403).json({
                code: 403,
                message: AuthorizationMessage.NotAccess,
            })
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = CheckAdminAccessibility
