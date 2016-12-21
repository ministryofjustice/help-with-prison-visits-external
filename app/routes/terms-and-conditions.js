module.exports = function (router) {
  router.get('/terms-and-conditions', function (req, res) {
    return res.render('terms-and-conditions')
  })
}
