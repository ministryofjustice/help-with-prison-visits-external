module.exports = function (router) {
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'APVS index' })
    next()
  })
}
