const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const ValidationError = require('../../../../services/errors/validation-error')
const dateFormatter = require('../../../../services/date-formatter')
const moment = require('moment')
const Claim = require('../../../../services/domain/claim')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('first-time/eligibility/new-claim/journey-information', {
      reference: req.params.reference
    })
  })

  // TODO: Add branches based on question responses.
  // TODO: Need to generate real Claim ID at this point.
  router.post('/first-time-claim/eligibility/:reference/new-claim/past', function (req, res) {
    UrlPathValidator(req.params)

    var dateOfJourney = parseDate(
      req.body['date-of-journey-day'],
      req.body['date-of-journey-month'],
      req.body['date-of-journey-year']
    )

    try {
      var claim = new Claim(
        req.params.reference,
        dateOfJourney.date.toDate(),
        moment().toDate(),
        null,
        'IN-PROGRESS'
      )
      // TODO: Persist claim record
      console.log(claim)
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('first-time/eligibility/new-claim/journey-information', {
          claim: req.body,
          errors: error.validationErrors
        })
      } else {
        throw error
      }
    }

    var stubId = '123'
    return res.redirect(`/first-time-claim/eligibility/${req.params.reference}/claim/${stubId}`)
  })
}

function parseDate (day, month, year) {
  return {
    date: dateFormatter.build(day, month, year),
    formattedString: dateFormatter.buildFormatted(day, month, year)
  }
}
