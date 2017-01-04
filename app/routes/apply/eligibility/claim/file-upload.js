const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const DocumentTypeEnum = require('../../../../constants/document-type-enum')
const DirectoryCheck = require('../../../../services/directory-check')
const Upload = require('../../../../services/upload')
const ValidationError = require('../../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../../services/validators/validation-error-messages')
const FileUpload = require('../../../../services/domain/file-upload')
const ClaimDocumentInsert = require('../../../../services/data/insert-file-upload-details-for-claim')
const csrfProtection = require('csurf')({ cookie: true })
const generateCSRFToken = require('../../../../services/generate-csrf-token')
var csrfToken
const logger = require('../../../../services/log')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/file-upload', function (req, res) {
    get(req, res)
  })

  router.get('/your-claims/:dob/:reference/:claimId/file-upload', function (req, res) {
    get(req, res)
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/file-upload', function (req, res, next) {
    post(req, res, next, `/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
  })

  router.post('/your-claims/:dob/:reference/:claimId/file-upload', function (req, res, next) {
    post(req, res, next, `/your-claims/${req.params.dob}/${req.params.reference}/${req.params.claimId}`)
  })
}

function get (req, res) {
  csrfToken = generateCSRFToken(req)
  UrlPathValidator(req.params)

  if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
    DirectoryCheck(req.params.referenceId, req.params.claimId, req.query.claimExpenseId, req.query.document)
    return res.render('apply/eligibility/claim/file-upload', {
      document: req.query.document,
      fileUploadGuidingText: DocumentTypeEnum,
      URL: req.url,
      hideAlternative: req.query.hideAlt
    })
  } else {
    throw new Error('Not a valid document type')
  }
}

function post (req, res, next, redirectURL) {
  UrlPathValidator(req.params)
  var reference
  var id
  if (req.params.referenceId) {
    var referenceAndEligibility = referenceIdHelper.extractReferenceId(req.params.referenceId)
    reference = referenceAndEligibility.reference
    id = referenceAndEligibility.id
  } else {
    reference = req.params.reference
    id = req.query.eligibilityId
  }

  Upload(req, res, function (error) {
    try {
      logger.info('Request contents:')
      logger.info(req.file)
      // If there was no file attached, we still need to check the CSRF token
      if (!req.file) {
        logger.info('No file was detected')
        csrfProtection(req, res, function (error) {
          if (error) { throw error }
        })
      }
      if (error) {
        throw new ValidationError({upload: [ERROR_MESSAGES.getUploadTooLarge]})
      } else {
        if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
          logger.info('Valid - creating FileUpload object')
          var fileUpload = new FileUpload(req.params.claimId, req.query.document, req.query.claimExpenseId, req.file, req.error, req.body.alternative)

          ClaimDocumentInsert(reference, id, req.params.claimId, fileUpload).then(function () {
            res.redirect(redirectURL)
          }).catch(function (error) {
            next(error)
          })
        } else {
          throw new Error('Not a valid document type')
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/file-upload', {
          errors: error.validationErrors,
          document: req.query.document,
          fileUploadGuidingText: DocumentTypeEnum,
          URL: req.URL,
          csrfToken: csrfToken,
          hideAlternative: req.query.hideAlt
        })
      } else {
        next(error)
      }
    }
  })
}

