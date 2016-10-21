module.exports = function (router) {
  router.get('/claim-details', function (req, res) {
    return res.render('ux/claim/claim-details')
  })
}
