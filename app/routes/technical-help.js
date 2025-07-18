module.exports = router => {
  router.get('/help', (_req, res) => {
    return res.render('technical-help', {})
  })
}
