const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const disableNonTicketedExpensesForClaim = require('../../../../app/services/data/disable-non-ticketed-expenses-for-claim')
const insertExpense = require('../../../../app/services/data/insert-expense')
const insertClaimDocument = require('../../../../app/services/data/insert-file-upload-details-for-claim')
const documentHelper = require('../../../helpers/data/claim-document-helper')

describe('services/data/disable-non-ticketed-expenses-for-claim', function () {
  const REFERENCE = 'DISEXPS'
  let eligibilityId
  let claimId

  const TICKETED_EXPENSE_TYPE = 'bus'
  const NON_TICKETED_EXPENSE_TYPE = 'car'

  beforeEach(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId

        const ticketedExpense = expenseHelper.build(claimId)
        ticketedExpense.expenseType = TICKETED_EXPENSE_TYPE

        const nonticketedExpense = expenseHelper.build(claimId)
        nonticketedExpense.expenseType = NON_TICKETED_EXPENSE_TYPE

        return insertExpense(REFERENCE, eligibilityId, claimId, ticketedExpense)
          .then(function (expenseIds) {
            const documentForTicketedExpense = documentHelper.buildExpenseDoc(claimId, expenseIds[0].ClaimExpenseId)
            return insertClaimDocument(REFERENCE, eligibilityId, claimId, documentForTicketedExpense)
              .then(function () {
                return insertExpense(REFERENCE, eligibilityId, claimId, nonticketedExpense)
                  .then(function (expenseIds) {
                    const documentForNonTicketedExpense = documentHelper.buildExpenseDoc(claimId, expenseIds[0].ClaimExpenseId)
                    return insertClaimDocument(REFERENCE, eligibilityId, claimId, documentForNonTicketedExpense)
                  })
              })
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
                expect(expense.IsEnabled).to.be.false  //eslint-disable-line
              }
            })
          })
      })
  })

  it('should disable documents supporting previous expenses for non-ticketed expense types', function () {
    return disableNonTicketedExpensesForClaim(REFERENCE, eligibilityId, claimId, NON_TICKETED_EXPENSE_TYPE)
      .then(function () {
        return expenseHelper.getAll(claimId)
          .then(function (expenses) {
            expenses.forEach(function (expense) {
              if (expense.ExpenseType === NON_TICKETED_EXPENSE_TYPE) {
                return documentHelper.getAllForExpense(expense.ClaimExpenseId)
                  .then(function (documents) {
                    documents.forEach(function (document) {
                      expect(document.IsEnabled).to.be.false  //eslint-disable-line
                    })
                  })
              }
            })
          })
      })
  })

  it('should not disable documents if expenses are not disabled', function () {
    return expenseHelper.getAll(claimId)
      .then(function (expenses) {
        expenses.forEach(function (expense) {
          if (expense.ExpenseType === NON_TICKETED_EXPENSE_TYPE) {
            return documentHelper.getAllForExpense(expense.ClaimExpenseId)
              .then(function (documents) {
                documents.forEach(function (document) {
                  expect(document.IsEnabled).to.be.true  //eslint-disable-line
                })
              })
          }
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
                expect(expense.IsEnabled).to.be.true  //eslint-disable-line
              }
            })
          })
      })
  })

  it('should not disable documents supporting previous expenses for ticketed expense types', function () {
    return disableNonTicketedExpensesForClaim(REFERENCE, eligibilityId, claimId, TICKETED_EXPENSE_TYPE)
      .then(function () {
        return expenseHelper.getAll(claimId)
          .then(function (expenses) {
            expenses.forEach(function (expense) {
              if (expense.ExpenseType === TICKETED_EXPENSE_TYPE) {
                return documentHelper.getAllForExpense(expense.ClaimExpenseId)
                  .then(function (documents) {
                    documents.forEach(function (document) {
                      expect(document.IsEnabled).to.be.true  //eslint-disable-line
                    })
                  })
              }
            })
          })
      })
  })

  afterEach(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
