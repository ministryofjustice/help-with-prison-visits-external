/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */

var routes = [
  require('./index'),
  require('./eligibility-requirements'),
  require('./start'),
  require('./eligibility-fail'),
  require('./payment/bank-account-details'),
  require('./application-submitted'),

  // First Time Flow.
  require('./first-time/date-of-birth.js'),
  require('./first-time/prisoner-relationship'),
  require('./first-time/journey-assistance'),
  require('./first-time/benefits'),
  require('./first-time/about-the-prisoner.js'),
  require('./first-time/about-you.js'),

  // Health check routes
  require('./health-check/status'),

  // These are temporary UX routes.
  require('./ux/file-upload'),
  require('./ux/eligibility/confirm-your-details'),
  require('./ux/claim/visit-type'),
  require('./ux/claim/your-journey'),
  require('./ux/claim/transport'),
  require('./ux/claim/additional-expenses'),
  require('./ux/claim/light-refreshment-details'),
  require('./ux/claim/claim-summary'),
  require('./ux/claim/car-details'),
  require('./ux/claim/taxi-details'),
  require('./ux/claim/train-details'),
  require('./ux/claim/profile'),
  require('./ux/claim/claim-details'),

  // These are temporary development routes included for demonstration only. TODO THESE SHOULD BE REMOVED
  require('./dev/display-data-for-reference'),
  require('./dev/gov-notify')
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
