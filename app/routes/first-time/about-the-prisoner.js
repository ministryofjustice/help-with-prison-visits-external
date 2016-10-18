
module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    // TODO path validation
    res.render('first-time/about-the-prisoner', {
      dob: req.params.dob,
      relationship: req.params.relationship,
      assistance: req.params.assistance,
      requireBenefitUpload: req.params.requireBenefitUpload
    })
    next()
  })

  router.post('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    // TODO path validation
    var reference = '1234567' // TODO call to persist and create eligibility reference
    res.redirect(`/first-time/${req.params.dob}/${req.params.relationship}/${req.params.assistance}/${req.params.requireBenefitUpload}/${reference}`)
    next()
  })
}
