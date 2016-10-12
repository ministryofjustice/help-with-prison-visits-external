module.exports = function (router) {
  router.get('/status', function (req, res, next) {
    res.sendStatus(200)
    next()
  })
}
