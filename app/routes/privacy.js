module.exports = router => {
  router.get('/privacy', (req, res) => {
    return res.render('privacy')
  })
}
