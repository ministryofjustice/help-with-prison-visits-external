module.exports = function (router) {
  router.get('/taxi-details', function (req, res) {
    res.render('claim/taxi-details')
  })
}
