const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const REFERENCE = 'LASTCD1'
const ELIGIBILITYID = '1234'
const LAST_NAME = 'Bloggs'
const LAST_NAME_MASKED = 'B*****'

const CLAIMID = [{ ClaimId: 1, IsAdvanceClaim: false }]
const CHILDREN = [{ ClaimChildId: 1, LastName: LAST_NAME }]
const EXPENSES = [{ ClaimExpenseId: 2, ExpenseType: 'bus', Cost: '20' }, { ClaimExpenseId: 3, ExpenseType: 'taxi', Cost: '15' }, { ClaimExpenseId: 4, ExpenseType: 'train', Cost: '10' }, { ClaimExpenseId: 5, ExpenseType: 'train', Cost: '5' }]
const ESCORT = [{ ClaimEscortId: 3, LastName: LAST_NAME }]
const CLAIMID2 = [{ ClaimId: 2, IsAdvanceClaim: true }]

const getLastClaimForReferenceStub = sinon.stub()
const getClaimChildrenByIdOrLastApprovedStub = sinon.stub().resolves(CHILDREN)
const getClaimExpenseByIdOrLastApprovedStub = sinon.stub().resolves(EXPENSES)
const getClaimEscortByIdOrLastApprovedStub = sinon.stub().resolves(ESCORT)
const maskArrayOfNamesStub = sinon.stub().returns(LAST_NAME_MASKED)

const getLastClaimDetails = proxyquire('../../../../app/services/data/get-last-claim-details', {
  './get-last-claim-for-reference': getLastClaimForReferenceStub,
  './get-claim-children-by-id-or-last-approved': getClaimChildrenByIdOrLastApprovedStub,
  './get-claim-expense-by-id-or-last-approved': getClaimExpenseByIdOrLastApprovedStub,
  './get-claim-escort-by-id-or-last-approved': getClaimEscortByIdOrLastApprovedStub,
  '../helpers/mask-array-of-names': maskArrayOfNamesStub
})

describe('services/data/get-last-claim-details', function () {
  it('should call to get last claim children and last claim expenses', function () {
    getLastClaimForReferenceStub.resolves(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, false)
      .then(function (result) {
        sinon.assert.calledWith(getLastClaimForReferenceStub, REFERENCE, ELIGIBILITYID)
        sinon.assert.calledWith(getClaimChildrenByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        sinon.assert.calledWith(getClaimExpenseByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        sinon.assert.calledWith(getClaimEscortByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        sinon.assert.notCalled(maskArrayOfNamesStub)

        expect(result.children).to.be.equal(CHILDREN)
        expect(result.expenses).to.be.equal(EXPENSES)
        expect(result.escort).to.be.equal(ESCORT)
      })
  })

  it('should mask child last name and escort last name if mask is true', function () {
    getLastClaimForReferenceStub.resolves(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, true, false)
      .then(function (result) {
        sinon.assert.calledWith(getLastClaimForReferenceStub, REFERENCE, ELIGIBILITYID)
        sinon.assert.calledWith(getClaimChildrenByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        sinon.assert.calledWith(getClaimExpenseByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        sinon.assert.calledWith(getClaimEscortByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, CLAIMID[0].ClaimId)
        sinon.assert.calledWith(maskArrayOfNamesStub, CHILDREN)
        sinon.assert.calledWith(maskArrayOfNamesStub, ESCORT)
      })
  })

  it('should get last claim and remove train expenses if last claim type is not the same as this claim type', function () {
    getLastClaimForReferenceStub.resolves(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, true)
      .then(function (result) {
        expect(result.expenses.filter(expense => expense.ExpenseType === 'train').length).to.be.equal(0)
        expect(result.expenses.length).to.be.equal(2)
      })
  })

  it('should get last claim and keep train expenses if last claim type is the same as this claim type', function () {
    getLastClaimForReferenceStub.resolves(CLAIMID)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, false)
      .then(function (result) {
        expect(result.expenses.filter(expense => expense.ExpenseType === 'train').length).to.be.equal(2)
        expect(result.expenses.length).to.be.equal(4)
      })
  })

  it('should get last claim and reset train expenses to zero if last claim type is the same as this claim type', function () {
    getLastClaimForReferenceStub.resolves(CLAIMID2)
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID, false, true)
      .then(function (result) {
        const trainExpenses = result.expenses.filter(expense => expense.ExpenseType === 'train')

        trainExpenses.forEach(function (expense) {
          expect(expense.Cost).to.be.equal('0')
        })

        expect(result.expenses.filter(expense => expense.ExpenseType === 'train').length).to.be.equal(2)
        expect(result.expenses.length).to.be.equal(4)
      })
  })
})
