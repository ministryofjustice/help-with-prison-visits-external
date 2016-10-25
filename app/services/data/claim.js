const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const claimStatusEnum = require('../../constants/claim-status-enum')
const moment = require('moment')

module.exports.insert = function (reference, claimData) {
  var dateOfJourney = moment(claimData.DateOfJourney).toDate()
  var dateCreated = moment(claimData.DateCreated).toDate()
  var dateSubmitted = moment(claimData.DateSubmitted).toDate()

  return knex('Claim').insert({
    Reference: reference,
    DateOfJourney: dateOfJourney,
    DateCreated: dateCreated,
    DateSubmitted: dateSubmitted,
    Status: claimData.Status
  })
}
