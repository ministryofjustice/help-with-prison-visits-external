const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const DocumentTypeEnum = require('../../../../constants/document-type-enum')
// const DirectoryCheck = require('../../../../services/directory-check')
const Upload = require('../../../../services/upload')
const ValidationError = require('../../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../../services/validators/validation-error-messages')
const FileUpload = require('../../../../services/domain/file-upload')
const moveFile = require('../../../../services/move-file')
const disableOldClaimDocuments = require('../../../../services/data/disable-old-claim-documents')
const ClaimDocumentInsert = require('../../../../services/data/insert-file-upload-details-for-claim')
const csrfProtection = require('csurf')({ cookie: true })
const generateCSRFToken = require('../../../../services/generate-csrf-token')
const decrypt = require('../../../../services/helpers/decrypt')
const clam = require('../../../../services/clam-av')
const config = require('../../../../../config')
const tasksEnum = require('../../../../constants/tasks-enum')
const insertTask = require('../../../../services/data/insert-task')
const logger = require('../../../../services/log')
const SessionHandler = require('../../../../services/validators/session-handler')
const checkExpenseIsEnabled = require('../../../../services/data/check-expense-is-enabled')
const Promise = require('bluebird').Promise
const fs = Promise.promisifyAll(require('fs'))
let csrfToken

module.exports = function (router) {
  router.get('/apply/eligibility/claim/summary/file-upload', function (req, res) {
    req.yourClaimUrl = '/apply/eligibility/claim/summary'
    get(req, res)
  })

  router.get('/your-claims/:claimId/file-upload', function (req, res) {
    req.yourClaimUrl = `/your-claims/${req.params.claimId}`
    get(req, res)
  })

  router.post('/apply/eligibility/claim/summary/file-upload',
    function (req, res, next) {
      req.yourClaimUrl = '/apply/eligibility/claim/summary'
      post(req, res, next)
    },
    function (req, res, next) {
      checkForMalware(req, res, next, '/apply/eligibility/claim/summary')
    })

  router.post('/your-claims/:claimId/file-upload',
    function (req, res, next) {
      req.yourClaimUrl = `/your-claims/${req.params.claimId}`
      post(req, res, next)
    },
    function (req, res, next) {
      checkForMalware(req, res, next, `/your-claims/${req.params.claimId}`)
    })
}

function get (req, res) {
  csrfToken = generateCSRFToken(req)
  UrlPathValidator(req.params)
  const isValidSession = SessionHandler.validateSession(req.session, req.url)

  if (!isValidSession) {
    return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
  }

  setReferenceIds(req)
  if (req.query.claimExpenseId != null) {
    // check that the expense is still enabled
    checkExpenseIsEnabled(req.query.claimExpenseId)
      .then(function (claimExpense) {
        if (claimExpense.length === 0) {
          renderFileUploadPage(req, res)
        } else if (claimExpense[0].IsEnabled) {
          renderFileUploadPage(req, res)
        } else {
          // claimant has probably clicked the back button after deleting expense
          req.session.ExpenseIsEnabled = 'false'
          res.redirect(req.yourClaimUrl)
        }
      })
  } else {
    renderFileUploadPage(req, res)
  }
}

function renderFileUploadPage (req, res) {
  if (Object.prototype.hasOwnProperty.call(DocumentTypeEnum, req.query.document)) {
    const decryptedRef = decrypt(req.session.referenceId)

    const claimId = addClaimIdIfNotBenefitDocument(req.query.document, req.session.claimId)
    // DirectoryCheck(decryptedRef, claimId, req.query.claimExpenseId, req.query.document)

    return res.render('apply/eligibility/claim/file-upload', {
      document: req.query.document,
      fileUploadGuidingText: DocumentTypeEnum,
      URL: req.url,
      yourClaimUrl: req.yourClaimUrl,
      hideAlternative: req.query.hideAlt
    })
  } else {
    throw new Error('Not a valid document type')
  }
}

function post (req, res, next, redirectURL) {
  UrlPathValidator(req.params)
  const isValidSession = SessionHandler.validateSession(req.session, req.url)

  if (!isValidSession) {
    return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
  }

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
        throw new ValidationError({ upload: [ERROR_MESSAGES.getUploadTooLarge] })
      } else {
        if (!(Object.prototype.hasOwnProperty.call(DocumentTypeEnum, req.query.document))) {
          throw new Error('Not a valid document type')
        }
      }
      req.fileUpload = new FileUpload(req.session.claimId, req.query.document, req.query.claimExpenseId, req.file, req.error, req.body.alternative)
      next()
    } catch (error) {
      handleError(req, res, next, error)
    }
  })
}

function checkForMalware (req, res, next, redirectURL) {
  const ids = setReferenceIds(req)
  const claimId = addClaimIdIfNotBenefitDocument(req.query.document, req.session.claimId)
  if (req.file) {
    clam.scan(req.file.path).then((infected) => {
      if (infected) insertMalwareAlertTask(ids, claimId, req.file.path)
      return moveScannedFileToStorage(req, res, next).then(function () {
        return updateClaimDocumentMetadata(ids, claimId, req).then(function () {
          res.redirect(redirectURL)
        })
      })
    }).catch((error) => {
      handleError(req, res, next, error)
    }).finally(() => {
      if (req.file) unlinkFile(req.file.path)
    })
  } else {
    // This handles the case were Post/Upload Later is selected, so no actual file is being provided,
    // however we still need to insert metadata indicating that the user selected on of these options
    updateClaimDocumentMetadata(ids, claimId, req).then(function () {
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
      yourClaimUrl: req.yourClaimUrl,
      csrfToken: csrfToken,
      hideAlternative: req.query.hideAlt
    })
  } else {
    next(error)
  }
}

function setReferenceIds (req) {
  let reference
  let id
  if (req.session.referenceId) {
    const referenceAndEligibility = referenceIdHelper.extractReferenceId(req.session.referenceId)
    reference = referenceAndEligibility.reference
    id = referenceAndEligibility.id
  } else {
    reference = req.session.decryptedRef
    id = req.query.eligibilityId
    req.session.referenceId = referenceIdHelper.getReferenceId(reference, id)
  }
  return { eligibilityId: id, reference: reference }
}

function moveScannedFileToStorage (req, res, next) {
  const tempPath = req.file.path
  const filenamePrefix = getFilenamePrefix(req)
  const filename = req.file.filename
  return moveFile(tempPath, filenamePrefix, filename)
    .then(function (targetFileName) {
      req.fileUpload.path = targetFileName
    })
}

function insertMalwareAlertTask (ids, claimId, path) {
  insertTask(ids.reference, ids.eligibilityId, claimId, tasksEnum.SEND_MALWARE_ALERT, config.MALWARE_NOTIFICATION_EMAIL_ADDRESS)
    .then(function () {
      logger.warn(`Malware detected in file ${path}`)
    })

  throw new ValidationError({ upload: [ERROR_MESSAGES.getMalwareDetected] })
}

function updateClaimDocumentMetadata (ids, claimId, req) {
  return disableOldClaimDocuments(ids.reference, claimId, req.fileUpload, req.query.hideAlt)
    .then(function () {
      return ClaimDocumentInsert(ids.reference, ids.eligibilityId, claimId, req.fileUpload)
    })
}

function unlinkFile (path) {
  return fs.unlinkAsync(path).then(() => {
    logger.info(`Removed temporary file ${path}`)
  }).catch(function (error) {
    logger.error(error)
  })
}

function getFilenamePrefix (req) {
  const decryptedReferenceId = decrypt(req.session.referenceId)

  if (req.query.document !== 'VISIT_CONFIRMATION' && req.query.document !== 'RECEIPT') {
    return `${decryptedReferenceId}${config.FILE_SEPARATOR}${config.FILE_SEPARATOR}${config.FILE_SEPARATOR}${req.query.document}`
  } else if (req.query.claimExpenseId) {
    return `${decryptedReferenceId}${config.FILE_SEPARATOR}${req.session.claimId}${config.FILE_SEPARATOR}${req.query.claimExpenseId}${config.FILE_SEPARATOR}${req.query.document}`
  }

  return `${decryptedReferenceId}${config.FILE_SEPARATOR}${req.session.claimId}${config.FILE_SEPARATOR}${config.FILE_SEPARATOR}${req.query.document}`
}

function addClaimIdIfNotBenefitDocument (document, claimId) {
  if (document === 'VISIT_CONFIRMATION' || document === 'RECEIPT') {
    return claimId
  } else {
    return null
  }
}
