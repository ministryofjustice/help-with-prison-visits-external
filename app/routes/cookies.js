module.exports = router => {
  router.get('/cookies', (req, res) => {
    return res.render('cookies')
  })
}
