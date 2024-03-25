const sinon = require('sinon')

const REFERENCE = 'V123456'
const CLAIMID = 1234
const DOB = '10-10-1990'
const ELIGIBILITYID = 1234

jest.mock('./get-repeat-eligibility', () => getRepeatEligibilityStub);

jest.mock(
  './get-claim-expense-by-id-or-last-approved',
  () => getClaimExpenseByIdOrLastApprovedStub
);

jest.mock(
  './get-claim-children-by-id-or-last-approved',
  () => getClaimChildrenByIdOrLastApprovedStub
);

jest.mock('./get-historic-claim-by-claim-id', () => getHistoricClaimByClaimIdStub);

jest.mock(
  './get-claim-documents-historic-claim',
  () => getClaimDocumentsHistoricClaimStub
);

jest.mock(
  './get-all-claim-documents-by-claim-id',
  () => getAllClaimDocumentsByClaimIdStub
);

jest.mock('./get-claim-events', () => getClaimEventsStub);

jest.mock(
  '../helpers/sort-view-claim-results-helper',
  () => sortViewClaimResultsHelperStub
);

describe('services/data/get-view-claim', function () {
  let getViewClaim
  let getRepeatEligibilityStub
  let getClaimExpenseByIdOrLastApprovedStub
  let getClaimChildrenByIdOrLastApprovedStub
  let getHistoricClaimByClaimIdStub
  let getClaimDocumentsHistoricClaimStub
  let getAllClaimDocumentsByClaimIdStub
  let getClaimEventsStub
  let sortViewClaimResultsHelperStub

  beforeAll(function () {
    getRepeatEligibilityStub = sinon.stub().resolves([[]])
    getClaimExpenseByIdOrLastApprovedStub = sinon.stub().resolves([])
    getClaimChildrenByIdOrLastApprovedStub = sinon.stub().resolves([])
    getHistoricClaimByClaimIdStub = sinon.stub().resolves([{ EligibilityId: ELIGIBILITYID }])
    getClaimDocumentsHistoricClaimStub = sinon.stub().resolves([])
    getAllClaimDocumentsByClaimIdStub = sinon.stub().resolves([])
    getClaimEventsStub = sinon.stub().resolves([])
    sortViewClaimResultsHelperStub = sinon.stub().returns([])

    getViewClaim = require('../../../../app/services/data/get-view-claim')
  })

  it('should call each data call, then return sorted results', function () {
    return getViewClaim(CLAIMID, REFERENCE, DOB)
      .then(function (result) {
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, DOB, null)).toBe(true)  //eslint-disable-line
        expect(getClaimExpenseByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getClaimChildrenByIdOrLastApprovedStub.calledWith(REFERENCE, null, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getHistoricClaimByClaimIdStub.calledWith(REFERENCE, DOB, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getClaimDocumentsHistoricClaimStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID)).toBe(true)  //eslint-disable-line
        expect(getAllClaimDocumentsByClaimIdStub.calledWith(CLAIMID, REFERENCE, ELIGIBILITYID)).toBe(true)  //eslint-disable-line
        sinon.toHaveBeenCalledTimes(1)
      });
  })
})
