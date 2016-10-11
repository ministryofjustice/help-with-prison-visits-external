module.exports = function (router) {
  router.get('/eligibility-requirements', function (req, res) {
    res.render('eligibility/eligibility-requirements')
  })
}
