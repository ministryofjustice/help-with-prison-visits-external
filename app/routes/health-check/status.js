const { monitoringMiddleware, endpointHealthComponent } = require('@ministryofjustice/hmpps-monitoring')

const log = require('../../services/log')
const config = require('../../../config')
const applicationInfo = require('../../application-version')

module.exports = router => {
  const apiConfig = Object.entries(config.apis)

  const middleware = monitoringMiddleware({
    applicationInfo,
    healthComponents: apiConfig.map(([name, options]) => endpointHealthComponent(log, name, options)),
  })

  router.get('/health', middleware.health)
  router.get('/info', middleware.info)
  router.get('/ping', middleware.ping)
}
