const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
// TODO: Use a domain object to persist rather than req.body.

module.exports = function (claimId, expenseType, reqBody) {
  // TODO: Add error handling.

  console.log(claimId)
  console.log(expenseType)
  console.log(reqBody)

  return knex('ClaimExpense').insert({
    ClaimId: claimId,
    ExpenseType: expenseType,
    Cost: reqBody.cost || 0,
    NumberOfNights: reqBody['number-of-nights'] || '',
    TravelTime: reqBody['travel-time'] || ''
  })
}
