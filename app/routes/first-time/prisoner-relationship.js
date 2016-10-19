const prisonerRelationshipValidator = require('../../services/validators/eligibility/prisoner-relationship-validator')

module.exports = function (router) {
  router.get('/first-time/:dob', function (req, res, next) {
    var dob = req.params.dob

    // TODO: Add URL Validation.

    res.render('first-time/prisoner-relationship', { dob: dob })
    next()
  })

  // TODO: Split the reltionship values into an enum module.
  router.post('/first-time/:dob', function (req, res, next) {
    var relationship = req.body.relationship
    var dob = req.params.dob
    var validationErrors = prisonerRelationshipValidator(req.body)

    // TODO: Add URL Validation.

    if (validationErrors) {
      res.status(400).render('first-time/prisoner-relationship', { errors: validationErrors, dob: dob })
      return next()
    }

    if (relationship === 'None of the above') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship)
    }
    next()
  })
}
