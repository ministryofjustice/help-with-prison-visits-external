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
const decrypt = require('../../../../services/helpers/decrypt')
const clam = require('../../../../services/clam-av')
const config = require('../../../../../config')
const tasksEnum = require('../../../../constants/tasks-enum')
const insertTask = require('../../../../services/data/insert-task')
const logger = require('../../../../services/log')
var path = require('path')
var Promise = require('bluebird').Promise
var fs = Promise.promisifyAll(require('fs'))
var csrfToken

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/file-upload', function (req, res) {
    get(req, res)
  })

  router.get('/your-claims/:dob/:reference/:claimId/file-upload', function (req, res) {
    get(req, res)
  })

  router.post('/apply/:claimType/eligibility/:referenceId/claim/:claimId/summary/file-upload',
    function (req, res, next) {
      post(req, res, next)
    },
    function (req, res, next) {
      checkForMalware(req, res, next, `/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`)
    })

  router.post('/your-claims/:dob/:reference/:claimId/file-upload', function (req, res, next) {
    post(req, res, next, `/your-claims/${req.params.dob}/${req.params.reference}/${req.params.claimId}`)
  })
}

function get (req, res) {
  csrfToken = generateCSRFToken(req)
  UrlPathValidator(req.params)

  if (DocumentTypeEnum.hasOwnProperty(req.query.document)) {
    var decryptedRef = getDecryptedReference(req.params)
    var claimId = addClaimIdIfNotBenefitDocument(req.query.document, req.params.claimId)
    DirectoryCheck(decryptedRef, claimId, req.query.claimExpenseId, req.query.document)
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
  setReferenceIds(req)

  Upload(req, res, function (error) {
    try {
      // If there was no file attached, we still need to check the CSRF token
      if (!req.file) {
        csrfProtection(req, res, function (error) {
          if (error) throw error
        })
      }

      if (error) {
        throw new ValidationError({upload: [ERROR_MESSAGES.getUploadTooLarge]})
      } else {
        if (!DocumentTypeEnum.hasOwnProperty(req.query.document)) {
          throw new Error('Not a valid document type')
        }
      }
      req.fileUpload = new FileUpload(req.params.claimId, req.query.document, req.query.claimExpenseId, req.file, req.error, req.body.alternative)
      next()
    } catch (error) {
      handleError(req, res, next, error)
    }
  })
}

function checkForMalware (req, res, next, redirectURL) {
  var ids = setReferenceIds(req)
  if (req.file) {
    var claimId = addClaimIdIfNotBenefitDocument(req.query.document, req.params.claimId)
    clam.scan(req.file.path).then((infected) => {
      try {
        if (infected) {
          insertTask(ids.reference, ids.eligibilityId, claimId, tasksEnum.SEND_MALWARE_ALERT, config.MALWARE_NOTIFICATION_EMAIL_ADDRESS).then(function () {
            logger.warn(`Malware detected in file ${req.file.path}`)
          })
          throw new ValidationError({upload: [ERROR_MESSAGES.getMalwareDetected]})
        }

        moveScannedFileToStorage(req, getTargetDir(req))
        ClaimDocumentInsert(ids.reference, ids.eligibilityId, claimId, req.fileUpload).then(function () {
          res.redirect(redirectURL)
        }).catch(function (error) {
          next(error)
        })
      } catch (error) {
        handleError(req, res, next, error)
      }
    })
  } else {
    ClaimDocumentInsert(ids.reference, ids.eligibilityId, claimId, req.fileUpload).then(function () {
      res.redirect(redirectURL)
    }).catch(function (error) {
      next(error)
    })
  }
}

function handleError (req, res, next, error) {
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

function setReferenceIds (req) {
  var reference
  var id
  if (req.params.referenceId) {
    var referenceAndEligibility = referenceIdHelper.extractReferenceId(req.params.referenceId)
    reference = referenceAndEligibility.reference
    id = referenceAndEligibility.id
  } else {
    reference = decrypt(req.params.reference)
    id = req.query.eligibilityId
    req.params.referenceId = referenceIdHelper.getReferenceId(reference, id)
  }
  return { eligibilityId: id, reference: reference }
}

function moveScannedFileToStorage (req, targetDir) {
  var targetFilePath = path.join(targetDir, req.file.filename)
  fs.renameAsync(req.file.path, targetFilePath)
  req.fileUpload.destination = targetDir
  req.fileUpload.path = targetFilePath
}

function getTargetDir (req) {
  var decryptedReferenceId = decrypt(req.params.referenceId)
  var targetDir
  if (req.query.document !== 'VISIT_CONFIRMATION' && req.query.document !== 'RECEIPT') {
    targetDir = `${config.FILE_UPLOAD_LOCATION}/${decryptedReferenceId}/${req.query.document}`
  } else if (req.query.claimExpenseId) {
    targetDir = `${config.FILE_UPLOAD_LOCATION}/${decryptedReferenceId}/${req.params.claimId}/${req.query.claimExpenseId}/${req.query.document}`
  } else {
    targetDir = `${config.FILE_UPLOAD_LOCATION}/${decryptedReferenceId}/${req.params.claimId}/${req.query.document}`
  }
  return targetDir
}

function getDecryptedReference (requestParams) {
  if (requestParams.referenceId) {
    return decrypt(requestParams.referenceId)
  } else if (requestParams.reference) {
    return decrypt(requestParams.reference)
  } else {
    return null
  }
}

function addClaimIdIfNotBenefitDocument (document, claimId) {
  if (document === 'VISIT_CONFIRMATION' || document === 'RECEIPT') {
    return claimId
  } else {
    return null
  }
}
