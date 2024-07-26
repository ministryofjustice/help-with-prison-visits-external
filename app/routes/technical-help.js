module.exports = function (router) {
  router.get('/help', function (_req, res) {
    return res.render('technical-help', {})
  })
}
