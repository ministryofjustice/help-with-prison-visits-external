const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const FutureOrPastVisit = require('../../../../services/domain/future-or-past-visit')
const ValidationError = require('../../../../services/errors/validation-error')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/new-claim/future-or-past-visit', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    return res.render('apply/eligibility/new-claim/future-or-past-visit', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId
    })
  })

  router.post('/apply/eligibility/new-claim/future-or-past-visit', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      var futureOrPastVisit = new FutureOrPastVisit((req.body && req.body['advance-past']) ?? '') // eslint-disable-line
      req.session.advanceOrPast = (req.body && req.body['advance-past']) ?? ''

      let nextPage = 'journey-information'
      if (req.session.claimType === claimTypeEnum.REPEAT_CLAIM) {
        nextPage = 'same-journey-as-last-claim'
      }

      return res.redirect(`/apply/eligibility/new-claim/${nextPage}`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/new-claim/future-or-past-visit', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId
        })
      } else {
        throw error
      }
    }
  })
}
