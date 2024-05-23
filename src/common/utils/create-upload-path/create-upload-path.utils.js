const fs = require('fs')
const path = require('path')
const createUploadPath = (extraName = '') => {
    const uploadPath = path.join(__dirname, '..', '..', '..', '..', 'public', 'upload', extraName)
    fs.mkdirSync(uploadPath, { recursive: true })
    return path.join('public', 'upload')
}
module.exports = createUploadPath
