const expect = require('chai').expect
const insertExpense = require('../../../../app/services/data/insert-expense')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')

describe('services/data/insert-expense', function () {
  const REFERENCE = 'V123467'
  var eligibilityId
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should insert a new expense', function () {
    return insertExpense(REFERENCE, eligibilityId, claimId, expenseHelper.build(claimId))
      .then(function () {
        return expenseHelper.get(claimId)
      })
      .then(function (expense) {
        expect(expense.EligibilityId).to.equal(eligibilityId)
        expect(expense.Reference).to.equal(REFERENCE)
        expect(expense.ClaimId).to.equal(claimId)
        expect(expense.ExpenseType.toString()).to.equal(expenseHelper.EXPENSE_TYPE)
        expect(expense.Cost.toString()).to.equal(expenseHelper.COST)
        expect(expense.TravelTime).to.equal(expenseHelper.TRAVEL_TIME)
        expect(expense.From.toString()).to.equal(expenseHelper.FROM)
        expect(expense.To.toString()).to.equal(expenseHelper.TO)
        expect(expense.IsReturn).to.equal(expenseHelper.IS_RETURN === 'yes')
        expect(expense.DurationOfTravel).to.equal(expenseHelper.DURATION_OF_TRAVEL)
        expect(expense.TicketType).to.equal(expenseHelper.TICKET_TYPE)
        expect(expense.TicketOwner).to.equal(expenseHelper.TICKET_OWNER)
      })
  })

  it('should throw an error if passed a non-expense object.', function () {
    return expect(function () {
      insertExpense(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
