module.exports = function (router) {
  router.get('/visit-type', function (req, res) {
    res.render('eligibility/visit-type')
  })
}
