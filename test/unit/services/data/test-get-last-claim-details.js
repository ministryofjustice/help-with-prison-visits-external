const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const REFERENCE = 'LASTCD1'
const ELIGIBILITYID = '1234'

const CHILDREN = [{ClaimChildId: 1}]
const EXPENSES = [{ClaimExpenseId: 2}]

var getLastClaimChildrenStub = sinon.stub().resolves(CHILDREN)
var getLastClaimExpensesStub = sinon.stub().resolves(EXPENSES)

const getLastClaimDetails = proxyquire('../../../../app/services/data/get-last-claim-details', {
  './get-last-claim-children': getLastClaimChildrenStub,
  './get-last-claim-expenses': getLastClaimExpensesStub
})

describe('services/data/get-last-claim-details', function () {
  it('should call to get last claim children and last claim expenses', function () {
    getLastClaimDetails(REFERENCE, ELIGIBILITYID)
      .then(function (result) {
        sinon.assert.calledWith(getLastClaimChildrenStub, REFERENCE, ELIGIBILITYID)
        sinon.assert.calledWith(getLastClaimExpensesStub, REFERENCE, ELIGIBILITYID)

        expect(result.children).to.be.equal(CHILDREN)
        expect(result.expenses).to.be.equal(EXPENSES)
      })
  })
})
