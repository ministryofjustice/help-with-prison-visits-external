module.exports = function (router) {
  router.get('/car-details', function (req, res) {
    res.render('claim/car-details')
  })
}
