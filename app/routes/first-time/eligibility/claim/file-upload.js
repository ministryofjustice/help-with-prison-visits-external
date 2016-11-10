const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const FileUploadGuidingText = require('../../../../constants/file-upload-guiding-text-enum')
const DocumentTypeEnum = require('../../../../constants/document-type-enum')
const DirectoryCheck = require('../../../../services/directory-check')
const Upload = require('../../../../services/upload')
const ValidationError = require('../../../../services/errors/validation-error')
const FileUpload = require('../../../../services/domain/file-upload')
const ClaimDocumentInsert = require('../../../../services/data/insert-file-upload-details-for-claim')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res) {
    UrlPathValidator(req.params)
    if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
      DirectoryCheck(req.params.reference, req.params.claimId, req.query.claimExpenseId, req.query.document)
      res.render('first-time/eligibility/claim/file-upload', {
        document: req.query.document,
        fileUploadGuidingText: FileUploadGuidingText,
        URL: req.url
      })
    } else {
      throw new Error('Not a valid document type')
    }
  })

  router.post('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res) {
    UrlPathValidator(req.params)
    Upload(req, res, function (error) {
      try {
        if (error) {
          throw new ValidationError({upload: ['File uploaded too large']})
        } else {
          if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
            var fileUpload = new FileUpload(req.params.claimId, req.query.document, req.query.claimExpenseId, req.file, req.fileTypeError, req.body.alternative)
            ClaimDocumentInsert(fileUpload).then(function () {
              res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}/summary`)
            })
          } else {
            throw new Error('Not a valid document type')
          }
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).render('first-time/eligibility/claim/file-upload', {
            document: req.query.document,
            fileUploadGuidingText: FileUploadGuidingText,
            errors: error.validationErrors,
            URL: req.url
          })
        } else {
          throw error
        }
      }
    })
  })
}
