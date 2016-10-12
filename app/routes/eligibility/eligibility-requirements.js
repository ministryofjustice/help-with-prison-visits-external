module.exports = function (router) {
  router.get('/eligibility-requirements', function (req, res, next) {
    res.render('eligibility/eligibility-requirements')
    next()
  })
}
