const DateOfBirth = require('../../../services/domain/date-of-birth')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const ERROR_MESSAGES = require('../../../services/validators/validation-error-messages')
const SessionHandler = require('../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/new-eligibility/test', function (req, res) {
    console.log("\n\n\n\nIn test get method")
    UrlPathValidator(req.params)
    var errors

    req.session = SessionHandler.clearSession(req.session, req.url)

    if ((req.query.error === 'expired')) {
      errors = { expired: [ ERROR_MESSAGES.getExpiredSessionDOB ] }
    }

    return res.render('apply/new-eligibility/test', {
      errors: errors,
      recovery: req.query.recovery,
      claimType: req.params.claimType,
      pageType: "New test page",
      otherPageType: "Other page",
      pageBlank: true
    })
  })

  router.post('/apply/new-eligibility/test', function (req, res, next) {
    console.log("\n\n\n\n\n\nIn test post method")
    UrlPathValidator(req.params)
    
    var name = req.body['newName'] + " Extra stuff at end";
    var extraInfo = req.body['otherThings'] + " other Extra stuff at end";
    req.session.dobEncoded = dateOfBirth.encodedDate
    return res.render('apply/new-eligibility/test', {
        errors: errors,
        recovery: req.query.recovery,
        claimType: req.params.claimType,
        pageType: "New test page",
        otherPageType: "Other page",
        pageBlank: false,
        newName: name,
        extraStuff: extraInfo
      })

  })
}
