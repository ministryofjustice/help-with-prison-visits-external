var expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const REFERENCE = 'V123456'
const CLAIMID = 1234
const DOB = '10-10-1990'

const INTERNAL_DOCUMENTS_VISIT = [{DocumentType: 'VISIT-CONFIRMATION'}]
const INTERNAL_DOCUMENTS_MULTI = [{DocumentType: 'working-tax-credit'}]
const EXTERNAL_DOCUMENTS_VISIT = [{DocumentType: 'VISIT-CONFIRMATION'}]
const EXTERNAL_DOCUMENTS_MULTI = [{Name: 'file1', DocumentType: 'working-tax-credit'}, {Name: 'file2', DocumentType: 'working-tax-credit'}]

describe('services/data/get-view-claim', function () {
  var getViewClaim
  var getRepeatEligibilityStub
  var getClaimExpenseByIdOrLastApprovedStub
  var getClaimChildrenByIdOrLastApprovedStub
  var getHistoricClaimByClaimIdStub
  var getClaimDocumentsHistoricClaimStub
  var getAllClaimDocumentsByClaimIdStub

  before(function () {
    getRepeatEligibilityStub = sinon.stub().resolves({Reference: REFERENCE})
    getClaimExpenseByIdOrLastApprovedStub = sinon.stub().resolves([])
    getClaimChildrenByIdOrLastApprovedStub = sinon.stub().resolves([])
    getHistoricClaimByClaimIdStub = sinon.stub().resolves([{}])
    getClaimDocumentsHistoricClaimStub = sinon.stub()
    getAllClaimDocumentsByClaimIdStub = sinon.stub()

    getViewClaim = proxyquire('../../../../app/services/data/get-view-claim', {
      './get-repeat-eligibility': getRepeatEligibilityStub,
      './get-claim-expense-by-id-or-last-approved': getClaimExpenseByIdOrLastApprovedStub,
      './get-claim-children-by-id-or-last-approved': getClaimChildrenByIdOrLastApprovedStub,
      './get-historic-claim-by-claim-id': getHistoricClaimByClaimIdStub,
      './get-claim-documents-historic-claim': getClaimDocumentsHistoricClaimStub,
      './get-all-claim-documents-by-claim-id': getAllClaimDocumentsByClaimIdStub
    })
  })

  it('should only internal documents', function () {
    getClaimDocumentsHistoricClaimStub.resolves(INTERNAL_DOCUMENTS_VISIT)
    getAllClaimDocumentsByClaimIdStub.resolves([])
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, DOB, null)).to.be.true
        expect(getClaimExpenseByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).to.be.true
        expect(getClaimChildrenByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).to.be.true
        expect(getHistoricClaimByClaimIdStub.calledWith(REFERENCE, DOB, CLAIMID)).to.be.true
        expect(getClaimDocumentsHistoricClaimStub.calledWith(REFERENCE, CLAIMID)).to.be.true
        expect(getAllClaimDocumentsByClaimIdStub.calledWith(CLAIMID)).to.be.true

        expect(result.claim.visitConfirmation.DocumentType).to.equal(INTERNAL_DOCUMENTS_VISIT[0].DocumentType)
        expect(result.claim.visitConfirmation.fromInternalWeb).to.be.true
      })
  })

  it('should only replace internal document with external document', function () {
    getClaimDocumentsHistoricClaimStub.resolves(INTERNAL_DOCUMENTS_VISIT)
    getAllClaimDocumentsByClaimIdStub.resolves(EXTERNAL_DOCUMENTS_VISIT)
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, DOB, null)).to.be.true
        expect(getClaimExpenseByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).to.be.true
        expect(getClaimChildrenByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).to.be.true
        expect(getHistoricClaimByClaimIdStub.calledWith(REFERENCE, DOB, CLAIMID)).to.be.true
        expect(getClaimDocumentsHistoricClaimStub.calledWith(REFERENCE, CLAIMID)).to.be.true
        expect(getAllClaimDocumentsByClaimIdStub.calledWith(CLAIMID)).to.be.true

        expect(result.claim.visitConfirmation.DocumentType).to.equal(EXTERNAL_DOCUMENTS_VISIT[0].DocumentType)
        expect(result.claim.visitConfirmation.fromInternalWeb).to.be.false
      })
  })

  it('should only replace internal documents with external multipage documents', function () {
    getClaimDocumentsHistoricClaimStub.resolves(INTERNAL_DOCUMENTS_MULTI)
    getAllClaimDocumentsByClaimIdStub.resolves(EXTERNAL_DOCUMENTS_MULTI)
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, DOB, null)).to.be.true
        expect(getClaimExpenseByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).to.be.true
        expect(getClaimChildrenByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).to.be.true
        expect(getHistoricClaimByClaimIdStub.calledWith(REFERENCE, DOB, CLAIMID)).to.be.true
        expect(getClaimDocumentsHistoricClaimStub.calledWith(REFERENCE, CLAIMID)).to.be.true
        expect(getAllClaimDocumentsByClaimIdStub.calledWith(CLAIMID)).to.be.true

        expect(result.claim.benefitDocument[1].DocumentType).to.equal(EXTERNAL_DOCUMENTS_MULTI[0].DocumentType)
        expect(result.claim.benefitDocument[1].Name).to.equal(EXTERNAL_DOCUMENTS_MULTI[0].Name)
        expect(result.claim.benefitDocument[0].DocumentType).to.equal(EXTERNAL_DOCUMENTS_MULTI[1].DocumentType)
        expect(result.claim.benefitDocument[0].Name).to.equal(EXTERNAL_DOCUMENTS_MULTI[1].Name)
        expect(result.claim.benefitDocument[0].fromInternalWeb).to.be.false
      })
  })
})
