module.exports = router => {
  router.get('/eligibility-fail', (req, res) => {
    return res.render('eligibility-fail')
  })
}
