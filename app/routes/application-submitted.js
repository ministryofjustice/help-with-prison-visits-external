module.exports = function (router) {
  router.get('/application-submitted', function (req, res) {
    res.render('application-submitted')
  })
}
