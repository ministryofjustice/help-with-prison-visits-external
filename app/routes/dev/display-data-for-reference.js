var devData = require('../../services/data/dev-data')

module.exports = function (router) {
  router.get('/dev-data/:reference', function (req, res) {
    devData.get(req.params.reference).then(function (data) {
      var json = JSON.stringify(data, null, '\t')
      console.log(json)
      return res.render('dev/display-data-for-reference', {
        reference: req.params.reference,
        data: json
      })
    })
  })
}
