module.exports = function (router) {
  router.get('/start', function (req, res, next) {
    res.render('start')
    next()
  })
}
