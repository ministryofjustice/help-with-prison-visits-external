const prisonerRelationshipValidator = require('../../services/validators/eligibility/prisoner-relationship-validator')
const dateOfBirthValidator = require('../../services/validators/eligibility/date-of-birth-validator')
const benefitValidator = require('../../services/validators/eligibility/benefit-validator')

module.exports = function (router) {
  // Date of Birth
  router.get('/first-time', function (req, res, next) {
    res.render('eligibility/date-of-birth')
    next()
  })

  // TODO: Need age check here. If under 16 redirect to eligibility-fail. Add this to the validation logic for the page.
  router.post('/first-time', function (req, res, next) {
    var validationErrors = dateOfBirthValidator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/date-of-birth', { errors: validationErrors })
      return next()
    }
    res.redirect('/first-time/' + buildDOB(req))
    next()
  })

  // Prisoner-relationship
  router.get('/first-time/:dob', function (req, res, next) {
    var dob = req.params.dob
    res.render('eligibility/prisoner-relationship', { dob: dob })
    next()
  })

  // TODO: Split the reltionship values into an enum module.

  router.post('/first-time/:dob', function (req, res, next) {
    var relationship = req.body.relationship
    var dob = req.params.dob
    var validationErrors = prisonerRelationshipValidator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/prisoner-relationship', { errors: validationErrors, dob: dob })
      return next()
    }

    if (relationship === 'None of the above') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship)
    }
    next()
  })

  // Benefits
  router.get('/first-time/:dob/:relationship', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship
    res.render('eligibility/benefits', { dob: dob, relationship: relationship })
    next()
  })

  router.post('/first-time/:dob/:relationship', function (req, res, next) {
    var benefit = req.body.benefit
    var dob = req.params.dob
    var relationship = req.params.relationship
    var validationErrors = benefitValidator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/benefits', { errors: validationErrors, dob: dob, relationship: relationship })
      return next()
    }

    if (benefit === 'None of the above') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + benefit)
    }
    next()
  })

  // Journey assistance
  router.get('/first-time/:dob/:relationship/:benefit', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit

    res.render('eligibility/journey-assistance', { dob: dob, relationship: relationship, benefit: benefit })
    next()
  })

// TODO Post on joureny-assistance
// router.post('/journey-assistance', function (req, res, next) {
//   res.redirect('benefits')
//   next()
// })
}

// TODO: Need to use the Date constructor here and then return a parsed object (without the time stamp) for routing to the next page
function buildDOB (req) {
  var day = req.body['dob-day']
  var month = req.body['dob-month']
  var year = req.body['dob-year']
  return day + '-' + month + '-' + year
}
