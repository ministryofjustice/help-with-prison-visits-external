module.exports = function (router) {
  router.get('/about-you', function (req, res, next) {
    res.render('eligibility/about-you')
    next()
  })

  router.post('/about-you', function (req, res, next) {
    res.redirect('file-upload')
    next()
  })
}
