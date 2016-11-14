const config = require('../../config')
var multer = require('multer')
var crypto = require('crypto')
var path = require('path')

const maxFileSize = parseInt(config.FILE_UPLOAD_MAXSIZE)
const allowedFileTypes = [ 'image/png', 'image/jpeg', 'application/pdf' ]

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${config.FILE_UPLOAD_LOCATION}/${req.params.referenceId}/${req.params.claimId}/${req.query.document}`)
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname))
      if (err) {
        throw new Error('Problem creating filename')
      }
    })
  }
})

function fileFilter (req, file, cb) {
  if (!allowedFileTypes.includes(file.mimetype)) {
    var error = 'Uploaded file was not an image.'
    req.fileTypeError = error
    return cb(null, false, new Error(error))
  }
  cb(null, true)
}

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize
  },
  fileFilter: fileFilter
}).single('document')
