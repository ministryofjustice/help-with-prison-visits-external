const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const fileUploadGuidingText = require('../../../../constants/file-upload-guiding-text-enum')
const documentTypeEnum = require('../../../../constants/document-type-enum')
const directoryCheck = require('../../../../services/directory-check')
const upload = require('../../../../services/upload')
const ValidationError = require('../../../../services/errors/validation-error')
const FileUpload = require('../../../../services/domain/file-upload')
const ClaimDocumentInsert = require('../../../../services/data/insert-file-upload-details-for-claim')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res) {
    UrlPathValidator(req.params)
    if (documentTypeEnum.hasOwnProperty(req.query.document)) {
      directoryCheck(req.params.reference, req.params.claimId, undefined, req.query.document)
      res.render('first-time/eligibility/claim/file-upload', {
        document: req.query.document,
        fileUploadGuidingText: fileUploadGuidingText,
        URL: req.url
      })
    } else {
      throw new Error('Not a valid document type')
    }
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/file-upload', upload, function (req, res) {
    UrlPathValidator(req.params)
    try {
      if (documentTypeEnum.hasOwnProperty(req.query.document)) {
        console.log(req.query.claimId)
        var fileUpload = new FileUpload(req.params.claimId, req.query.document, undefined, req.file, req.fileTypeError, req.body.alternative)
        console.log(fileUpload)
        ClaimDocumentInsert(fileUpload).then(function () {
          res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}/summary`)
        })
      } else {
        throw new Error('Not a valid document type')
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/claim/file-upload', {
          document: req.query.document,
          fileUploadGuidingText: fileUploadGuidingText,
          errors: error.validationErrors,
          URL: req.url
        })
      } else {
        throw error
      }
    }
  })
}
