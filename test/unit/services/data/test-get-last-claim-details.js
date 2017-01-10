const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const REFERENCE = 'LASTCD1'
const ELIGIBILITYID = '1234'

const CHILDREN = [{ClaimChildId: 1}]
const EXPENSES = [{ClaimExpenseId: 2}]
const ESCORT = [{ClaimEscortId: 3}]

var getClaimChildrenByIdOrLastApprovedStub = sinon.stub().resolves(CHILDREN)
var getClaimExpenseByIdOrLastApprovedStub = sinon.stub().resolves(EXPENSES)
var getClaimEscortByIdOrLastApprovedStub = sinon.stub().resolves(ESCORT)

const getLastClaimDetails = proxyquire('../../../../app/services/data/get-last-claim-details', {
  './get-claim-children-by-id-or-last-approved': getClaimChildrenByIdOrLastApprovedStub,
  './get-claim-expense-by-id-or-last-approved': getClaimExpenseByIdOrLastApprovedStub,
  './get-claim-escort-by-id-or-last-approved': getClaimEscortByIdOrLastApprovedStub
})

describe('services/data/get-last-claim-details', function () {
  it('should call to get last claim children and last claim expenses', function () {
    return getLastClaimDetails(REFERENCE, ELIGIBILITYID)
      .then(function (result) {
        sinon.assert.calledWith(getClaimChildrenByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(getClaimExpenseByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)
        sinon.assert.calledWith(getClaimEscortByIdOrLastApprovedStub, REFERENCE, ELIGIBILITYID, null)

        expect(result.children).to.be.equal(CHILDREN)
        expect(result.expenses).to.be.equal(EXPENSES)
        expect(result.escort).to.be.equal(ESCORT)
      })
  })
})
