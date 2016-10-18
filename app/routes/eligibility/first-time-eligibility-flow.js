const prisonerRelationshipValidator = require('../../services/validators/eligibility/prisoner-relationship-validator')
const dateOfBirthValidator = require('../../services/validators/eligibility/date-of-birth-validator')
const benefitValidator = require('../../services/validators/eligibility/benefit-validator')
const journeyAssistanceValidator = require('../../services/validators/eligibility/journey-assistance-validator')
const dateFormatter = require('../../services/date-formatter')

module.exports = function (router) {
  // Date of Birth
  router.get('/first-time', function (req, res, next) {
    res.render('eligibility/date-of-birth')
    next()
  })

  router.post('/first-time', function (req, res, next) {
    var validationErrors = dateOfBirthValidator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/date-of-birth', { claimant: req.body, errors: validationErrors })
      return next()
    }

    // TODO: Need age check here. If under 16 redirect to eligibility-fail.
    // if (isUnderSixteen) { }

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

  // Journey assistance
  router.get('/first-time/:dob/:relationship', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship

    res.render('eligibility/journey-assistance', { dob: dob, relationship: relationship })
    next()
  })

  router.post('/first-time/:dob/:relationship', function (req, res, next) {
    var journeyAssistance = req.body['journey-assistance']
    var dob = req.params.dob
    var relationship = req.params.relationship

    var validationErrors = journeyAssistanceValidator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/journey-assistance', { errors: validationErrors, dob: dob, relationship: relationship })
      return next()
    }

    res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + journeyAssistance)
    next()
  })

  // Benefits
  router.get('/first-time/:dob/:relationship/:journeyAssistance', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship
    var journeyAssistance = req.params.journeyAssistance
    res.render('eligibility/benefits', { dob: dob, relationship: relationship, journeyAssistance: journeyAssistance })
    next()
  })

  router.post('/first-time/:dob/:relationship/:journeyAssistance', function (req, res, next) {
    var benefit = req.body.benefit
    var dob = req.params.dob
    var relationship = req.params.relationship
    var journeyAssistance = req.params.journeyAssistance
    var validationErrors = benefitValidator(req.body)

    if (validationErrors) {
      res.status(400).render('eligibility/benefits', { errors: validationErrors, dob: dob, relationship: relationship, journeyAssistance: journeyAssistance })
      return next()
    }

    if (benefit === 'None of the above') {
      res.redirect('/eligibility-fail')
    } else {
      res.redirect('/first-time' + '/' + dob + '/' + relationship + '/' + journeyAssistance + '/' + benefit)
    }
    next()
  })

  // About the prisoner
  router.get('/first-time/:dob/:relationship/:journeyAssistance/:benefit', function (req, res, next) {
    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit
    var journeyAssistance = req.params.journeyAssistance

    res.render('eligibility/about-the-prisoner', { dob: dob, relationship: relationship, benefit: benefit, journeyAssistance: journeyAssistance })
    next()
  })
}

function buildDOB (req) {
  var day = req.body['dob-day']
  var month = req.body['dob-month']
  var year = req.body['dob-year']
  return dateFormatter.buildFormatted(day, month, year)
}
