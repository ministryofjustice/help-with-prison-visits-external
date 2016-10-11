module.exports = function (router) {
  router.get('/check-eligibility', function (req, res) {
    res.render('check-eligibility')
  })
}
