module.exports = function (router) {
  router.get('/eligibility-fail', function (req, res) {
    res.render('eligibility/eligibility-fail')
  })
}
