const multer = require('multer')
const path = require('path')
const { createUploadPath } = require('../create-upload-path')

const storage = multer.diskStorage({
    // مسیر فایل
    destination: (req, file, cb) => {
        cb(null, createUploadPath())
    },
    // تغییر نام فایل
    filename: (req, file, cb) => {
        const fileType = path.extname(file.originalname || '')
        cb(null, Date.now() + fileType)
    },
})
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const isImageType =
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        if (isImageType) {
            cb(null, true)
        } else {
            cb(new Error('فرمت فایل معتبر نیست'), false)
        }
    },
    limits: {
        fileSize: 100000, // 100KB
    },
})

module.exports = upload
