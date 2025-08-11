const { expect } = require('chai')
const moment = require('moment')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')

const MASKED_ADDRESS = { PostCode: '****3BT' }
let getRepeatEligibilityStub

let getAddressAndLinkDetails

const REFERENCE = 'V123456'
let eligibilityId
let claimId

describe('services/data/get-address-and-link-details', () => {
  before(() => {
    getRepeatEligibilityStub = sinon.stub().resolves(MASKED_ADDRESS)
    getAddressAndLinkDetails = proxyquire('../../../../app/services/data/get-address-and-link-details', {
      './get-repeat-eligibility': getRepeatEligibilityStub,
    })
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE).then(newEligibilityId => {
      eligibilityId = newEligibilityId
      return claimHelper.insert(REFERENCE, eligibilityId).then(newClaimId => {
        claimId = newClaimId
      })
    })
  })

  it('should return an unmasked address and details for change address link', () => {
    return getAddressAndLinkDetails(REFERENCE, claimId, claimTypeEnum.FIRST_TIME).then(function (address) {
      expect(address.HouseNumberAndStreet).to.equal(visitorHelper.HOUSE_NUMBER_AND_STREET)
      expect(address.Town).to.equal(visitorHelper.TOWN)
      expect(address.PostCode).to.equal(visitorHelper.POST_CODE)
      expect(moment(address.DateOfBirth).format('YYYY-MM-DD')).to.equal(visitorHelper.DATE_OF_BIRTH)
      expect(address.Benefit).to.equal(visitorHelper.BENEFIT)
      expect(address.Relationship).to.equal(visitorHelper.RELATIONSHIP)
    })
  })

  it('should call getRepeatEligibility and return masked data', () => {
    return getAddressAndLinkDetails(REFERENCE, claimId, claimTypeEnum.REPEAT_CLAIM).then(function (maskedAddress) {
        expect(getRepeatEligibilityStub.calledOnce).to.be.true  //eslint-disable-line
      expect(maskedAddress.PostCode).to.equal(MASKED_ADDRESS.PostCode)
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
