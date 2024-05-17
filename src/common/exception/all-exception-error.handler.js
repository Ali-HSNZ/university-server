const AllExceptionHandler = (app) => {
    app.use((err, req, res, next) => {
        const status = err?.status || 500
        const message = err?.message || 'InternalServerError'

        return res.status(status).json({
            code: status,
            invalidParams: err?.error,
            message: message,
        })
    })
}

module.exports = AllExceptionHandler
