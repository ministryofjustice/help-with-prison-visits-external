const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibilityId) {
  return knex('EligibilityVisitorUpdateContactDetail')
    .first('EmailAddress', 'PhoneNumber')
    .where({'Reference': reference, 'EligibilityId': eligibilityId})
    .orderBy('DateSubmitted', 'desc')
}
