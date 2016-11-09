const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const FirstTimeClaim = require('../../../../services/domain/first-time-claim')
const insertFirstTimeClaim = require('../../../../services/data/insert-first-time-claim')

module.exports = function (router) {
  router.get('/first-time/eligibility/:reference/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/new-claim/journey-information', {
      reference: req.params.reference
    })
  })

  router.post('/first-time/eligibility/:reference/new-claim/past', function (req, res, next) {
    UrlPathValidator(req.params)

    try {
      var firstTimeClaim = new FirstTimeClaim(
        req.params.reference,
        req.body['date-of-journey-day'],
        req.body['date-of-journey-month'],
        req.body['date-of-journey-year']
      )
      insertFirstTimeClaim(firstTimeClaim)
        .then(function (claimId) {
          if (req.body['child-visitor'] === 'yes') {
            return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${claimId}/child`)
          } else {
            return res.redirect(`/first-time/eligibility/${req.params.reference}/claim/${claimId}`)
          }
        })
        .catch(function (error) {
          next(error)
        })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/new-claim/journey-information', {
          reference: req.params.reference,
          claim: req.body,
          errors: error.validationErrors
        })
      } else {
        throw error
      }
    }
  })
}
