module.exports = function (router) {
  router.get('/claim-summary', function (req, res) {
    res.render('claim/claim-summary')
  })
}
