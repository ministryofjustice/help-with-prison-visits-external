module.exports = function (router) {
  router.get('/feedback', function (req, res) {
    return res.render('feedback', {
    })
  })
}
