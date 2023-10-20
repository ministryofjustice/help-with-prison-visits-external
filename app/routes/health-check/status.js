module.exports = function (router) {
  router.get('/status', function (req, res) {
    return res.sendStatus(200)
  })
  router.get('/health', function (req, res) {
    return res.json({
      status: 'UP'
    })
  })
}
