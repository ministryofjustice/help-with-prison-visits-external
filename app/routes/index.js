module.exports = function (route) {
  route.get('/', function (req, res, next) {
    res.render('index', { title: 'APVS index' })
    next()
  })
}
