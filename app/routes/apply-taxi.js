module.exports = function (router) {
  router.get('/apply-taxi', function (req, res) {
    res.render('apply-taxi')
  })
}
