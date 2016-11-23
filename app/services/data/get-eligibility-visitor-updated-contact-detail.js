const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibilityId) {
  return knex('EligibilityVisitorUpdateContactDetail')
    .where({'Reference': reference, 'EligibilityId': eligibilityId})
    .first('EmailAddress', 'PhoneNumber')
    .orderBy('DateSubmitted', 'desc')
}
