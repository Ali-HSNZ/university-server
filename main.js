const express = require('express')
const dotenv = require('dotenv')
const mainRouter = require('./src/app.routes')
const NotFoundHandler = require('./src/common/exception/not-found-error.handler')
const AllExceptionHandler = require('./src/common/exception/all-exception-error.handler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
dotenv.config()

const main = async () => {
    const app = express()
    const port = process.env.PORT

    // config app and Routes
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(morgan('dev'))
    app.use(mainRouter)

    // Error Handlers
    NotFoundHandler(app)
    AllExceptionHandler(app)

    app.listen(port, () => {
        console.log(`server started: http://localhost:${port}`)
    })
}
main()
