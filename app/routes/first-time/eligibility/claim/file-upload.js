const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const FileUploadGuidingText = require('../../../../constants/file-upload-guiding-text-enum')
const DocumentTypeEnum = require('../../../../constants/document-type-enum')
const DirectoryCheck = require('../../../../services/directory-check')
const Upload = require('../../../../services/upload')
const ValidationError = require('../../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../../services/validators/validation-error-messages')
const FileUpload = require('../../../../services/domain/file-upload')
const ClaimDocumentInsert = require('../../../../services/data/insert-file-upload-details-for-claim')
const csrfProtection = require('csurf')({ cookie: true })
var csrfToken

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res) {
    csrfToken = req.csrfToken()
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

  router.post('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res, next) {
    UrlPathValidator(req.params)
    Upload(req, res, function (error) {
      try {
        // If there was no file attached, we still need to check the CSRF token
        if (!req.file) {
          csrfProtection(req, res, function (error) {
            if (error) { throw error }
          })
        }
        if (error) {
          throw new ValidationError({upload: [ERROR_MESSAGES.getUploadTooLarge]})
        } else {
          if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
            var fileUpload = new FileUpload(req.params.claimId, req.query.document, req.query.claimExpenseId, req.file, req.error, req.body.alternative)

            ClaimDocumentInsert(fileUpload).then(function () {
              res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${req.params.claimId}/summary`)
            }).catch(function (error) {
              next(error)
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
            URL: req.url,
            csrfToken: csrfToken
          })
        } else {
          next(error)
        }
      }
    })
  })
}
