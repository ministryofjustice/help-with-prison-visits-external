module.exports = function (router) {
  router.get('/light-refreshment-details', function (req, res) {
    res.render('claim/light-refreshment-details')
  })
}
