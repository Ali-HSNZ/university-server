const jsonwebtoken = require('jsonwebtoken')

module.exports = (payload) => {
    const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: '1 days' })
    return token
}
