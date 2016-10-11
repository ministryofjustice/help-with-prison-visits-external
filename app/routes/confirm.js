module.exports = function (router) {
  router.get('/confirm', function (req, res) {
    res.render('confirm')
  })
}
