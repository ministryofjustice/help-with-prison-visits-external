module.exports = function (router) {
  router.get('/eligibility-yes', function (req, res) {
    res.render('eligibility-yes')
  })
}
