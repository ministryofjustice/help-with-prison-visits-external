module.exports = function (router) {
  router.get('/start', function (req, res) {
    res.render('start')
  })
}
