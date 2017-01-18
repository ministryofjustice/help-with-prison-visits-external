module.exports = function (router) {
  router.get('/cookies', function (req, res) {
    return res.render('cookies')
  })
}
