module.exports = function (router) {
  router.get('/claim-summary', function (req, res, next) {
    res.render('claim/claim-summary')
    next()
  })
}
