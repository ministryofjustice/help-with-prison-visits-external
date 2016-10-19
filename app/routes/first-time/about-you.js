var visitor = require('../../services/data/visitor')

module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res, next) {
    // TODO path validation
    res.render('first-time/about-you', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance,
      requireBenefitUpload: req.params.requireBenefitUpload,
      reference: req.params.reference
    })
    next()
  })

  router.post('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res, next) {
    // TODO path validation
    var validationErrors = false // TODO call validator

    if (validationErrors) {
      res.status(400).render('first-time/about-you', {
        dob: req.params.dob,
        relationship: req.params.relationship,
        assistance: req.params.assistance,
        requireBenefitUpload: req.params.requireBenefitUpload,
        reference: req.params.reference,
        visitor: req.body,
        errors: validationErrors })
      return next()
    }

    // TODO TEMP DATA replace with view req.body values
    var visitorData = {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Smith',
      nationalInsuranceNumber: 'QQ 12 34 56 c',
      houseNumberAndStreet: '1 Test Road',
      county: 'Durham',
      postCode: 'bT11 1BT',
      country: 'England',
      emailAddress: 'test@test.com',
      phoneNumber: '07911111111',
      dateOfBirth: '1980-02-01',
      relationship: 'partner',
      journeyAssistance: 'y75',
      requireBenefitUpload: 'n'
    }
    visitor.insert(req.params.reference, visitorData)
      .then(function () {
        res.redirect(`/application-submitted/${req.params.reference}`)
        next()
      })
      .catch(function (error) {
        next(error)
      })
  })
}
