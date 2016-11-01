const expect = require('chai').expect
const insertExpense = require('../../../../app/services/data/insert-expense')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')

describe('services/data/insert-expense', function () {
  it('should insert a new expense', function (done) {
    eligiblityHelper.insertEligibilityVisitorAndPrisoner()
      .then(function () {
        return claimHelper.insert(eligiblityHelper.REFERENCE)
      })
      .then(function () {
        return expenseHelper.insert(claimHelper.CLAIM_ID)
      })
      .then(function () {
        return expenseHelper.get(claimHelper.CLAIM_ID)
      })
      .then(function (expenses) {
        expect(expenses.length).to.equal(1)
        expect(expenses[0].ClaimId).to.equal(claimHelper.CLAIM_ID)
        expect(expenses[0].ExpenseType.toString()).to.equal(expenseHelper.EXPENSE_TYPE)
        expect(expenses[0].Cost.toString()).to.equal(expenseHelper.COST)
        expect(expenses[0].TravelTime).to.equal(expenseHelper.TRAVEL_TIME)
        expect(expenses[0].From.toString()).to.equal(expenseHelper.FROM)
        expect(expenses[0].To.toString()).to.equal(expenseHelper.TO)
        expect(expenses[0].IsReturn).to.equal(expenseHelper.IS_RETURN === 'yes')
        expect(expenses[0].DurationOfTravel).to.equal(expenseHelper.DURATION_OF_TRAVEL)
        expect(expenses[0].TicketType).to.equal(expenseHelper.TICKET_TYPE)
        done()
      })
  })

  it('should throw an error if passed a non-expense object.', function (done) {
    expect(function () {
      insertExpense({})
    }).to.throw(Error)
    done()
  })

  after(function (done) {
    expenseHelper.delete(claimHelper.CLAIM_ID)
      .then(function () {
        return claimHelper.delete(claimHelper.CLAIM_ID)
      })
      .then(function () {
        return eligiblityHelper.deleteEligibilityVisitorAndPrisoner()
      })
      .then(function () {
        done()
      })
  })
})
