
module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function (req, res, next) {
    // TODO path validation
    res.render('first-time/about-the-prisoner')
    next()
  })
}
