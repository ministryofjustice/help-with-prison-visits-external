/**
 * This file defines all routes used in this application. Any logic that is applicable to all routes can be added here.
 */

var routes = [
  require('./index'),
  require('./status'),
  require('./apply-1'),
  require('./apply-2'),
  require('./apply-3'),
  require('./apply-4'),
  require('./apply-5'),
  require('./apply-6'),
  require('./apply-7'),
  require('./apply-8'),
  require('./apply-9'),
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
  require('./profile'),
  require('./start'),
  require('./view-claim')
]

module.exports = function (router) {
  routes.forEach(function (route) {
    route(router)
  })
}
