
module.exports = function (router) {
  router.get('/first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function (req, res, next) {
    // TODO path validation
    res.render('first-time/about-you')
    next()
  })
}
