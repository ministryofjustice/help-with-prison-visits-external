module.exports = function (router) {
  router.get('/additional-expenses', function (req, res) {
    res.render('claim/additional-expenses')
  })
}
