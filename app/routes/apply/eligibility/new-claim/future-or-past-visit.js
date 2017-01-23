const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const FutureOrPastVisit = require('../../../../services/domain/future-or-past-visit')
const ValidationError = require('../../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/new-claim', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/new-claim/future-or-past-visit', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/new-claim', function (req, res) {
    UrlPathValidator(req.params)

    try {
      var futureOrPastVisit = new FutureOrPastVisit(req.body['advance-past']) // eslint-disable-line
      var advanceOrPast = req.body['advance-past']
      var nextPage = advanceOrPast
      if (req.params.claimType === claimTypeEnum.REPEAT_CLAIM) {
        nextPage = `same-journey-as-last-claim/${advanceOrPast}`
      }

      return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/new-claim/${nextPage}`)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/new-claim/future-or-past-visit', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          referenceId: req.params.referenceId
        })
      } else {
        throw error
      }
    }
  })
}
