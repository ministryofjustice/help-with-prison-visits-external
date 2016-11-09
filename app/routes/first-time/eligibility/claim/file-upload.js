const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const fileUploadGuidingText = require('../../../../constants/file-upload-guiding-text-enum')
const documentTypeEnum = require('../../../../constants/document-type-enum')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/claim/:claimId/file-upload', function (req, res, next) {
    UrlPathValidator(req.params)
    if (documentTypeEnum.hasOwnProperty(req.query.document)) {
      res.render('first-time/eligibility/claim/file-upload', {
        document: req.query.document,
        fileUploadGuidingText: fileUploadGuidingText
      })
    } else {
      return next()
    }
  })
}
