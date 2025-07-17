const expenseTypeEnum = require('../../constants/expense-type-enum')
const enumHelper = require('../../constants/helpers/enum-helper')
const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, eligibilityId, claimId, expenseType) => {
  const expense = enumHelper.getKeyByAttribute(expenseTypeEnum, expenseType)

  if (expense && !expense.ticketed) {
    const db = getDatabaseConnector()

    return db('ClaimExpense')
      .update('IsEnabled', false)
      .where({ ClaimId: claimId, ExpenseType: expenseType })
      .returning('ClaimExpenseId')
      .then(expenseIds => {
        if (expenseIds.length > 0) {
          const expenseIdList = expenseIds.map(expenseId => expenseId.ClaimExpenseId)
          return db('ClaimDocument').update('IsEnabled', false).whereIn('ClaimExpenseId', expenseIdList)
        }

        return Promise.resolve()
      })
  }

  return Promise.resolve()
}
