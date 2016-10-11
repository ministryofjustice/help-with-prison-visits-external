module.exports = function (router) {
  router.get('/apply-add-expense', function (req, res) {
    res.render('apply-add-expense')
  })
}
