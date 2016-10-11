/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */

var routes = [
  require('./index'),
  require('./status'),
  require('./eligibility/date-of-birth'),
  require('./eligibility/prisoner-relationship'),
  require('./eligibility/benefits'),
  require('./eligibility/benefits-on-behalf'),
  require('./eligibility/file-upload'),
  require('./eligibility/about-the-prisoner'),
  require('./eligibility/about-you'),
  require('./eligibility/visit-type'),
  require('./claim/your-journey'),
  require('./apply-10'),
  require('./apply-11'),
  require('./apply-22'),
  require('./apply-99'),
  require('./apply-1011'),
  require('./apply-add-expense'),
  require('./apply-add-food'),
  require('./apply-basket'),
  require('./apply-car'),
  require('./apply-previous-visit'),
  require('./apply-taxi'),
  require('./apply-train'),
  require('./apply-upload'),
  require('./check-eligibility'),
  require('./confirm'),
  require('./eligibility'),
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
