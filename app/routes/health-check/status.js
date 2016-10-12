module.exports = function (router) {
  router.get('/status', function (req, res) {
    res.sendStatus(200)
    next()
  })
}
