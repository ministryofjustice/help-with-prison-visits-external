module.exports = function (router) {
  router.get('/transport', function (req, res) {
    res.render('claim/transport')
  })
}
