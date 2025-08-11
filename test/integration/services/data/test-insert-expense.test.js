const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const expenseHelper = require('../../../helpers/data/expense-helper')

describe('services/data/insert-expense', () => {
  let insertExpense
  let disableNonTicketedExpensesForClaim

  const REFERENCE = 'INSEXPS'
  let eligibilityId
  let claimId

  before(() => {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
      claimId = ids.claimId
    })
  })

  beforeEach(() => {
    disableNonTicketedExpensesForClaim = sinon.stub().resolves()
    insertExpense = proxyquire('../../../../app/services/data/insert-expense', {
      './disable-non-ticketed-expenses-for-claim': disableNonTicketedExpensesForClaim,
    })
  })

  it('should insert a new expense', () => {
    return insertExpense(REFERENCE, eligibilityId, claimId, expenseHelper.build(claimId))
      .then(() => {
        return expenseHelper.get(claimId)
      })
      .then(expense => {
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
        expect(expense.ReturnTime).to.equal(expenseHelper.RETURN_TIME)
      })
  })

  it('should throw an error if passed a non-expense object.', () => {
    return expect(() => {
      insertExpense(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  it('should call to disable previous expenses for non-ticketed expense types', () => {
    return insertExpense(REFERENCE, eligibilityId, claimId, expenseHelper.build(claimId)).then(() => {
        expect(disableNonTicketedExpensesForClaim.calledOnce).to.be.true  //eslint-disable-line
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
