/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */

var routes = [
  require('./index'),
  require('./health-check/status'),
  require('./eligibility/date-of-birth'),
  require('./eligibility/prisoner-relationship'),
  require('./eligibility/benefits'),
  require('./eligibility/benefits-on-behalf'),
  require('./file-upload'),
  require('./eligibility/about-the-prisoner'),
  require('./eligibility/about-you'),
  require('./claim/visit-type'),
  require('./claim/your-journey'),
  require('./payment/bank-account-details'),
  require('./application-submitted'),
  require('./eligibility/journey-assistance'),
  require('./claim/transport'),
  require('./claim/additional-expenses'),
  require('./claim/light-refreshment-details'),
  require('./claim/claim-summary'),
  require('./claim/car-details'),
  require('./claim/taxi-details'),
  require('./claim/train-details'),
  require('./confirm'),
  require('./eligibility-requirements'),
  require('./eligibility-yes'),
  require('./claim/profile'),
  require('./start'),
  require('./claim/claim-details')
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
