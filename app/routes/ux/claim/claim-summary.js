module.exports = function (router) {
  router.get('/claim-summary', function (req, res, next) {
    res.render('ux/claim/claim-summary')
    next()
  })
}
