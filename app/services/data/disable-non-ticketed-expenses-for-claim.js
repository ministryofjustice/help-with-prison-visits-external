const expenseTypeEnum = require('../../constants/expense-type-enum')
const enumHelper = require('../../constants/helpers/enum-helper')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const Promise = require('bluebird')

module.exports = function (reference, eligibilityId, claimId, expenseType) {
  var expense = enumHelper.getKeyByAttribute(expenseTypeEnum, expenseType)

  if (expense && !expense.ticketed) {
    return knex('ClaimExpense')
      .update('IsEnabled', false)
      .where({ ClaimId: claimId, ExpenseType: expenseType }).returning('ClaimExpenseId')
      .then(function (expenseIds) {
        if (expenseIds.length > 0) {
          return knex('ClaimDocument')
            .update('IsEnabled', false)
            .whereIn('ClaimExpenseId', expenseIds)
        } else {
          return Promise.resolve()
        }
      })
  } else {
    return Promise.resolve()
  }
}
