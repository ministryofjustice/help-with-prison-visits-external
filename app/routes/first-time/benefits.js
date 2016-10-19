const benefitValidator = require('../../services/validators/eligibility/benefit-validator')

module.exports = function (router) {
  // Benefits
  router.get('/first-time/:dob/:relationship/:journeyAssistance', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship
    var journeyAssistance = req.params.journeyAssistance

    // TODO: Add URL Validation.

    res.render('first-time/benefits', { dob: dob, relationship: relationship, journeyAssistance: journeyAssistance })
    next()
  })

  router.post('/first-time/:dob/:relationship/:journeyAssistance', function (req, res, next) {
    var benefit = req.body.benefit
    var dob = req.params.dob
    var relationship = req.params.relationship
    var journeyAssistance = req.params.journeyAssistance
    var validationErrors = benefitValidator(req.body)

    // TODO: Add URL Validation.

    if (validationErrors) {
      res.status(400).render('first-time/benefits', { errors: validationErrors, dob: dob, relationship: relationship, journeyAssistance: journeyAssistance })
      return next()
    }

    if (benefit === 'none') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + journeyAssistance + '/' + benefit)
    }
    next()
  })
}
