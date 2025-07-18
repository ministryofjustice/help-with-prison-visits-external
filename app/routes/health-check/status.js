module.exports = router => {
  router.get('/status', (req, res) => {
    return res.sendStatus(200)
  })
  router.get('/health', (req, res) => {
    return res.json({
      status: 'UP',
    })
  })
}
