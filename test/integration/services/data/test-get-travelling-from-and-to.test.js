const { expect } = require('chai')
const getTravellingFromAndTo = require('../../../../app/services/data/get-travelling-from-and-to')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
const prisonerHelper = require('../../../helpers/data/prisoner-helper')

describe('services/data/get-travelling-from-and-to', () => {
  const REFERENCE = 'V123467'
  let eligibilityId
  const EXPECTED_RESULT = {
    from: visitorHelper.TOWN,
    to: prisonerHelper.NAME_OF_PRISON,
  }

  before(() => {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE).then(newEligibilityId => {
      eligibilityId = newEligibilityId
    })
  })

  it('should retrieve to and from information for the given reference and id', () => {
    return getTravellingFromAndTo(REFERENCE, eligibilityId).then(result => {
      expect(result).to.deep.equal(EXPECTED_RESULT)
    })
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
