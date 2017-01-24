const expect = require('chai').expect
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

describe('services/data/insert-expense', function () {
  var insertExpense
  var disableNonTicketedExpensesForClaim

  const REFERENCE = 'INSEXPS'
  var eligibilityId
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  beforeEach(function () {
    disableNonTicketedExpensesForClaim = sinon.stub().resolves()
    insertExpense = proxyquire('../../../../app/services/data/insert-expense', {
      './disable-non-ticketed-expenses-for-claim': disableNonTicketedExpensesForClaim
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
        expect(expense.DepartureTime).to.equal(expenseHelper.DEPARTURE_TIME)
      })
  })

  it('should throw an error if passed a non-expense object.', function () {
    return expect(function () {
      insertExpense(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  it('should call to disable previous expenses for non-ticketed expense types', function () {
    return insertExpense(REFERENCE, eligibilityId, claimId, expenseHelper.build(claimId))
      .then(function () {
        expect(disableNonTicketedExpensesForClaim.calledOnce).to.be.true
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
