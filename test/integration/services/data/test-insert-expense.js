const expect = require('chai').expect
const insertExpense = require('../../../../app/services/data/insert-expense')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')

describe('services/data/insert-expense', function () {
  const REFERENCE = 'V123467'

  it('should insert a new expense', function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
      .then(function () {
        return claimHelper.insert(REFERENCE)
      })
      .then(function () {
        return expenseHelper.insert(claimHelper.CLAIM_ID)
      })
      .then(function () {
        return expenseHelper.get(claimHelper.CLAIM_ID)
      })
      .then(function (expense) {
        expect(expense.ClaimId).to.equal(claimHelper.CLAIM_ID)
        expect(expense.ExpenseType.toString()).to.equal(expenseHelper.EXPENSE_TYPE)
        expect(expense.Cost.toString()).to.equal(expenseHelper.COST)
        expect(expense.TravelTime).to.equal(expenseHelper.TRAVEL_TIME)
        expect(expense.From.toString()).to.equal(expenseHelper.FROM)
        expect(expense.To.toString()).to.equal(expenseHelper.TO)
        expect(expense.IsReturn).to.equal(expenseHelper.IS_RETURN === 'yes')
        expect(expense.DurationOfTravel).to.equal(expenseHelper.DURATION_OF_TRAVEL)
        expect(expense.TicketType).to.equal(expenseHelper.TICKET_TYPE)
      })
  })

  it('should throw an error if passed a non-expense object.', function () {
    return expect(function () {
      insertExpense({})
    }).to.throw(Error)
  })

  after(function () {
    return expenseHelper.delete(claimHelper.CLAIM_ID)
      .then(function () {
        return claimHelper.delete(claimHelper.CLAIM_ID)
      })
      .then(function () {
        return eligiblityHelper.deleteEligibilityVisitorAndPrisoner(REFERENCE)
      })
  })
})
