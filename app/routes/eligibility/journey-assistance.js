module.exports = function (router) {
  router.get('/journey-assistance', function (req, res) {
    res.render('eligibility/journey-assistance')
  })
}
