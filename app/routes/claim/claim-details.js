module.exports = function (router) {
  router.get('/claim-details', function (req, res) {
    res.render('claim/claim-details')
  })
}
