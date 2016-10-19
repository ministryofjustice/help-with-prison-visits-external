const journeyAssistanceValidator = require('../../services/validators/eligibility/journey-assistance-validator')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship

    // TODO: Add URL Validation.

    res.render('first-time/journey-assistance', { dob: dob, relationship: relationship })
    next()
  })

  router.post('/first-time/:dob/:relationship', function (req, res, next) {
    var journeyAssistance = req.body['journey-assistance']
    var dob = req.params.dob
    var relationship = req.params.relationship

    var validationErrors = journeyAssistanceValidator(req.body)

    // TODO: Add URL Validation.

    if (validationErrors) {
      res.status(400).render('first-time/journey-assistance', { errors: validationErrors, dob: dob, relationship: relationship })
      return next()
    }

    res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + journeyAssistance)
    next()
  })
}
