module.exports = function (router) {
  router.get('/claim-summary', function (req, res) {
    return res.render('ux/claim/claim-summary')
  })
}
