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
  require('./first-time/new-eligibility/date-of-birth.js'),
  require('./first-time/new-eligibility/prisoner-relationship'),
  require('./first-time/new-eligibility/benefits'),
  require('./first-time/new-eligibility/about-the-prisoner.js'),
  require('./first-time/new-eligibility/about-you.js'),
  require('./first-time/eligibility/new-claim/future-or-past-visit.js'),
  require('./first-time/eligibility/new-claim/journey-information.js'),
  require('./first-time/eligibility/claim/about-child.js'),
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

  // Claim Summary
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
