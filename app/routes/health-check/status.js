module.exports = function (router) {
  router.get('/status', function (req, res) {
    return res.sendStatus(200)
  })
}
