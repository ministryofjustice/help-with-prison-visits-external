module.exports = function (router) {
  router.get('/application-submitted', function (req, res, next) {
    res.render('application-submitted')
    next()
  })
}
