module.exports = function (router) {
  router.get('/eligibility-fail', function (req, res, next) {
    res.render('eligibility/eligibility-fail')
    next()
  })
}
