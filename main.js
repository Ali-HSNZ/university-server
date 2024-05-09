const express = require('express')
const dotenv = require('dotenv')
// const swaggerConfig = require('./src/config/swagger.config')
const mainRouter = require('./src/app.routes')
const NotFoundHandler = require('./src/common/exception/not-found.handler')
const AllExceptionHandler = require('./src/common/exception/all-exception.handler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
dotenv.config()

const main = async () => {
    const app = express()
    const port = process.env.PORT

    // config mongoDB
    // require('./src/config/mongoose.config')

    // config app and Routes
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
    app.use(morgan('dev'))
    app.use(mainRouter)

    // config swagger
    // swaggerConfig(app)

    // Error Handlers
    NotFoundHandler(app)
    AllExceptionHandler(app)

    app.listen(port, () => {
        console.log(`server started: http://localhost:${port}`)
    })
}
main()
