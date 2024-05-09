const sql = require('mssql/msnodesqlv8')

// database configuration
module.exports = {
    user: '',
    password: '',
    database: 'university',
    server: 'DESKTOP-DDE6KEQ\\SA',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    },
}
 