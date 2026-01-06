const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const { validateRequest, invalidCsrfTokenError } = require('csrf-csrf')
const config = require('../../config')
const UploadError = require('./errors/upload-error')

const maxFileSize = parseInt(config.FILE_UPLOAD_MAXSIZE, 10)
const allowedFileTypes = ['image/png', 'image/x-png', 'image/jpeg', 'image/pjpeg', 'application/pdf']

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.FILE_TMP_DIR)
  },
  filename(req, file, cb) {
    crypto.randomBytes(16, (err, raw) => {
      cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname))
      if (err) {
        throw new Error('Problem creating filename')
      }
    })
  },
})

function fileFilter(req, file, cb) {
  if (validateRequest(req)) {
    req.error = invalidCsrfTokenError
    return cb(null, false, invalidCsrfTokenError)
  }
  if (!allowedFileTypes.includes(file.mimetype)) {
    const error = new UploadError('File type error')
    req.error = error
    return cb(null, false, error)
  }
  return cb(null, true)
}

module.exports = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter,
}).single('document')
