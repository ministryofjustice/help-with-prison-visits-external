const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const disableNonTicketedExpensesForClaim = require('../../../../app/services/data/disable-non-ticketed-expenses-for-claim')
const insertExpense = require('../../../../app/services/data/insert-expense')
const insertClaimDocument = require('../../../../app/services/data/insert-file-upload-details-for-claim')
const documentHelper = require('../../../helpers/data/claim-document-helper')

describe('services/data/disable-non-ticketed-expenses-for-claim', function () {
  const REFERENCE = 'DISEXPS'
  var eligibilityId
  var claimId

  const TICKETED_EXPENSE_TYPE = 'bus'
  const NON_TICKETED_EXPENSE_TYPE = 'car'

  beforeEach(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId

        var ticketedExpense = expenseHelper.build(claimId)
        ticketedExpense.expenseType = TICKETED_EXPENSE_TYPE

        var nonticketedExpense = expenseHelper.build(claimId)
        nonticketedExpense.expenseType = NON_TICKETED_EXPENSE_TYPE

        return insertExpense(REFERENCE, eligibilityId, claimId, ticketedExpense)
          .then(function (expenseIds) {
            var documentForTicketedExpense = documentHelper.buildExpenseDoc(claimId, expenseIds[0])
            return insertClaimDocument(REFERENCE, eligibilityId, claimId, documentForTicketedExpense)
              .then(function () {
                return insertExpense(REFERENCE, eligibilityId, claimId, nonticketedExpense)
                  .then(function (expenseIds) {
                    var documentForNonTicketedExpense = documentHelper.buildExpenseDoc(claimId, expenseIds[0])
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
                expect(expense.IsEnabled).to.be.false
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
                      expect(document.IsEnabled).to.be.false
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
                expect(document.IsEnabled).to.be.true
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
                expect(expense.IsEnabled).to.be.true
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
                    expect(document.IsEnabled).to.be.true
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
