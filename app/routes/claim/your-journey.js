module.exports = function (router) {
  router.get('/your-journey', function (req, res) {
    res.render('claim/your-journey')
  })
}
