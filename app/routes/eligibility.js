module.exports = function (router) {
  router.get('/eligibility', function (req, res) {
    res.render('eligibility')
  })
}
