const expenseTypeEnum = require('../../constants/expense-type-enum')
const enumHelper = require('../../constants/helpers/enum-helper')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const Promise = require('bluebird')

module.exports = function (reference, eligibilityId, claimId, expenseType) {
  var expense = enumHelper.getKeyByValue(expenseTypeEnum, expenseType)

  if (expense && !expense.ticketed) {
    return knex('ClaimExpense').update('IsEnabled', false).where({'ClaimId': claimId, 'ExpenseType': expenseType})
  } else {
    return Promise.resolve()
  }
}
