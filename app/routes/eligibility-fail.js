module.exports = function (router) {
  router.get('/eligibility-fail', function (req, res) {
    return res.render('eligibility-fail')
  })
}
