module.exports = function (router) {
  router.get('/start', function (req, res) {
    return res.render('start')
  })
}
