module.exports = function (router) {
  router.get('/eligibility-requirements', function (req, res) {
    return res.render('eligibility-requirements')
  })
}
