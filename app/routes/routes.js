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
  require('./first-time/benefits'),
  require('./first-time/about-the-prisoner.js'),
  // TODO refactor route to start from /first-time/eligibility/:reference with additional values in query string
  require('./first-time/about-you.js'),
  // TODO refactor route to start from /first-time/eligibility/:reference/new-claim
  require('./first-time/eligibility/new-claim/future-or-past-visit.js'),
  require('./first-time/eligibility/new-claim/journey-information.js'),
  // TODO all routes after this /first-time/eligibility/:reference/claim/:claimId
  require('./first-time/eligibility/claim/expenses'),
  require('./first-time/eligibility/claim/bank-account-details'),

  // Expenses
  require('./first-time/eligibility/claim/car-details'),
  require('./first-time/eligibility/claim/car-hire-details'),
  require('./first-time/eligibility/claim/bus-details'),
  require('./first-time/eligibility/claim/train-details'),
  require('./first-time/eligibility/claim/taxi-details'),
  require('./first-time/eligibility/claim/plane-details'),
  require('./first-time/eligibility/claim/ferry-details'),
  require('./first-time/eligibility/claim/light-refreshment-details'),
  require('./first-time/eligibility/claim/accommodation-details'),

  // Claim summary
  require('./first-time/eligibility/claim/claim-summary'),

  // Health check routes
  require('./health-check/status'),

  // These are temporary UX routes.
  require('./ux/file-upload'),
  require('./ux/eligibility/confirm-your-details'),
  require('./ux/claim/profile')
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
