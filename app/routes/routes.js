/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */

var routes = [
  require('./index'),
  require('./eligibility-requirements'),
  require('./start'),
  require('./eligibility-fail'),
  require('./application-submitted'),

  // First Time Flow.
  // TODO refactor route to start from /first-time/new-eligibility/
  require('./first-time/date-of-birth.js'),
  require('./first-time/prisoner-relationship'),
  require('./first-time/journey-assistance'),
  require('./first-time/benefits'),
  require('./first-time/about-the-prisoner.js'),
  // TODO refactor route to start from /first-time/eligibility/:reference with additional values in query string
  require('./first-time/about-you.js'),
  // TODO refactor route to start from /first-time/eligibility/:reference/new-claim
  require('./first-time/eligibility/new-claim/future-or-past-visit.js'),
  require('./first-time/eligibility/new-claim/journey-information.js'),
  // TODO all routes after this /first-time/eligibility/:reference/claim/:claim-ref
  require('./first-time/eligibility/claim/expenses'),
  require('./first-time/eligibility/claim/bank-account-details'),

  // Health check routes
  require('./health-check/status'),

  // These are temporary UX routes.
  require('./ux/file-upload'),
  require('./ux/eligibility/confirm-your-details'),
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
