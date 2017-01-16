const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const disableNonTicketedExpensesForClaim = require('../../../../app/services/data/disable-non-ticketed-expenses-for-claim')
const insertExpense = require('../../../../app/services/data/insert-expense')

describe('services/data/disable-non-ticketed-expenses-for-claim', function () {
  const REFERENCE = 'DISEXPS'
  var eligibilityId
  var claimId

  const TICKETED_EXPENSE_TYPE = 'bus'
  const NON_TICKETED_EXPENSE_TYPE = 'car'

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId

        var ticketedExpense = expenseHelper.build(claimId)
        ticketedExpense.expenseType = TICKETED_EXPENSE_TYPE

        var nonticketedExpense = expenseHelper.build(claimId)
        nonticketedExpense.expenseType = NON_TICKETED_EXPENSE_TYPE

        return insertExpense(REFERENCE, eligibilityId, claimId, ticketedExpense)
          .then(function () {
            return insertExpense(REFERENCE, eligibilityId, claimId, nonticketedExpense)
          })
      })
  })

  it('should disable previous expenses for non-ticketed expense types', function () {
    return disableNonTicketedExpensesForClaim(REFERENCE, eligibilityId, claimId, NON_TICKETED_EXPENSE_TYPE)
      .then(function () {
        return expenseHelper.getAll(claimId)
          .then(function (expenses) {
            expenses.forEach(function (expense) {
              if (expense.ExpenseType === NON_TICKETED_EXPENSE_TYPE) {
                expect(expense.IsEnabled).to.be.false
              }
            })
          })
      })
  })

  it('should not disable previous expenses for ticketed expense types', function () {
    return disableNonTicketedExpensesForClaim(REFERENCE, eligibilityId, claimId, TICKETED_EXPENSE_TYPE)
      .then(function () {
        return expenseHelper.getAll(claimId)
          .then(function (expenses) {
            expenses.forEach(function (expense) {
              if (expense.ExpenseType === TICKETED_EXPENSE_TYPE) {
                expect(expense.IsEnabled).to.be.true
              }
            })
          })
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
