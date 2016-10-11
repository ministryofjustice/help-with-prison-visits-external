module.exports = function (router) {
  router.get('/view-claim', function (req, res) {
    res.render('view-claim')
  })
}
