const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')
const insertTaskSendFirstTimeClaimNotification = require('./insert-task-send-first-time-claim-notification')
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const claimStatusEnum = require('../../constants/claim-status-enum')

module.exports = function (reference, claimId) {
  var dateSubmitted = moment().toDate()
  return knex('Eligibility').where('Reference', reference)
    .update({
      'Status': eligibilityStatusEnum.SUBMITTED,
      'DateSubmitted': dateSubmitted
    }).then(function () {
      return knex('Claim').where('ClaimId', claimId)
        .update({
          'Status': claimStatusEnum.SUBMITTED,
          'DateSubmitted': dateSubmitted
        })
        // TODO TEMPORARY CLAIM TRANSPORT AND EXPENSE INSERT
        // REMOVE WHEN EXPENSE FLOW IS PERSISTING AND REMOVE CLEANUP FROM TEST
        .then(function () {
          return knex('ClaimTransport').insert({
            ClaimId: claimId,
            TransportType: 'bus',
            From: 'London',
            To: 'Hewell',
            Cost: 10.50,
            IsReturn: true
          }).then(function () {
            return knex('ClaimExpense').insert({
              ClaimId: claimId,
              ExpenseType: 'refreshment',
              Cost: 5.55,
              TravelTime: 'under-five-hours'
            })
          })
        })
    }).then(function () {
      return insertTaskSendFirstTimeClaimNotification(reference, claimId)
    })
}
