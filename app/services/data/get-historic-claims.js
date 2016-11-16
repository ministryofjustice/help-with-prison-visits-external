const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')
const dateFormatter = require('../date-formatter')

module.exports = function (claimId, dob) {
  if (dob instanceof moment) {
    dob = dob.toDate()
  } else {
    dob = dateFormatter.buildFromDateString(dob).toDate()
  }
  return knex.raw(`SELECT * FROM [IntSchema].[getClaims] (?, ?)`, [ claimId, dob ])
}
