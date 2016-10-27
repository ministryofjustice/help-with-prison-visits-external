const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const dateFormatter = require('../../../../services/date-formatter')
const moment = require('moment')
const Claim = require('../../../../services/domain/claim')
const insertClaim = require('../../../../services/data/insert-claim')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/new-claim/journey-information', {
      reference: req.params.reference
    })
  })

  // TODO: Add branches based on question responses.
  router.post('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)

    var day = req.body['date-of-journey-day']
    var month = req.body['date-of-journey-month']
    var year = req.body['date-of-journey-year']

    var dateOfJourney = dateFormatter.build(day, month, year)

    try {
      var claim = new Claim(
        req.params.reference,
        dateOfJourney,
        moment(),
        null,
        'IN-PROGRESS'
      )
      insertClaim(claim)
        .then(function (result) {
          var claimId = result[0]
          return res.redirect(`/first-time-claim/eligibility/${req.params.reference}/claim/${claimId}`)
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
