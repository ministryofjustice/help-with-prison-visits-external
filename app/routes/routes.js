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
  require('./apply/new-eligibility/date-of-birth.js'),
  require('./apply/new-eligibility/prisoner-relationship'),
  require('./apply/new-eligibility/benefits'),
  require('./apply/new-eligibility/about-the-prisoner.js'),
  require('./apply/new-eligibility/about-you.js'),
  require('./apply/eligibility/new-claim/future-or-past-visit.js'),
  require('./apply/eligibility/new-claim/journey-information.js'),
  require('./apply/eligibility/claim/about-child.js'),
  require('./apply/eligibility/claim/expenses'),

  // Expenses
  require('./apply/eligibility/claim/car-details'),
  require('./apply/eligibility/claim/car-hire-details'),
  require('./apply/eligibility/claim/bus-details'),
  require('./apply/eligibility/claim/train-details'),
  require('./apply/eligibility/claim/taxi-details'),
  require('./apply/eligibility/claim/plane-details'),
  require('./apply/eligibility/claim/ferry-details'),
  require('./apply/eligibility/claim/light-refreshment-details'),
  require('./apply/eligibility/claim/accommodation-details'),

  // Claim Summary
  require('./apply/eligibility/claim/claim-summary'),
  require('./apply/eligibility/claim/file-upload'),
  require('./apply/eligibility/claim/bank-account-details'),

  // Your Claims Flow
  require('./your-claims/your-claims'),

  // Health check routes
  require('./health-check/status')
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
