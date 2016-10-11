module.exports = function (router) {
  router.get('/benefits-on-behalf', function (req, res) {
    res.render('eligibility/benefits-on-behalf')
  })
}
