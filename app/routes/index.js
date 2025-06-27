module.exports = function (router) {
  router.get('/', function (req, res) {
    return res.redirect('https://www.gov.uk/help-with-prison-visits')
  })

  router.get('/assisted-digital', function (req, res) {
    const caseworker = req.query?.caseworker

    if (caseworker) {
      // Create assisted digital cookie for a day
      res.cookie('apvs-assisted-digital', caseworker, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
    }

    return res.redirect('/start')
  })
}
