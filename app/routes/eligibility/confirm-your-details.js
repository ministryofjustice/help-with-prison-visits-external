module.exports = function (router) {
  router.get('/confirm-your-details', function (req, res) {
    res.render('eligibility/confirm-your-details')
  })
}
