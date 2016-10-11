module.exports = function (router) {
  router.get('/train-details', function (req, res) {
    res.render('claim/train-details')
  })
}
