var config = require('../../../knexfile').extweb
var knex = require('knex')(config)

module.exports.get = function (reference) {
  var data = {}
  return knex.table('Eligibility').first().then(function (eligibility) {
    data.Eligibility = eligibility
    console.log(eligibility)
    return data
  })
}
