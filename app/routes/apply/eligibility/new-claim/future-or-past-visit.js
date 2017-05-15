const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const FutureOrPastVisit = require('../../../../services/domain/future-or-past-visit')
const ValidationError = require('../../../../services/errors/validation-error')
const SessionValidator = require('../../../../services/validators/session-validator')

module.exports = function (router) {
  router.get('/apply/eligibility/new-claim/future-or-past-visit', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    return res.render('apply/eligibility/new-claim/future-or-past-visit', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId
    })
  })

  router.post('/apply/eligibility/new-claim/future-or-past-visit', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    try {
      var futureOrPastVisit = new FutureOrPastVisit(req.body['advance-past']) // eslint-disable-line
      req.session.advanceOrPast = req.body['advance-past']

      var nextPage = 'journey-information'
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
