var config = require('../../../knexfile').extweb
var knex = require('knex')(config)

module.exports.get = function (reference) {
  var data = {}
  return knex.table('Eligibility').where('Reference', reference).first().then(function (eligibility) {
    data.Eligibility = eligibility
    return knex.table('Prisoner').where('Reference', reference).first().then(function (prisoner) {
      data.Prisoner = prisoner
      return knex.table('Visitor').where('Reference', reference).first().then(function (visitor) {
        data.Visitor = visitor
        return data
      })
    })
  })
}
