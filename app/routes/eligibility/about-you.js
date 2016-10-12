module.exports = function (router) {
  router.get('/about-you', function (req, res) {
    res.render('eligibility/about-you')
  })

  router.post('/about-you', function (req, res) {
    res.redirect('file-upload')
  })
}
