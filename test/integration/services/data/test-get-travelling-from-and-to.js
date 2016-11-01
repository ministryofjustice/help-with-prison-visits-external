const getTravellingFromAndTo = require('../../../../app/services/data/get-travelling-from-and-to')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
const prisonerHelper = require('../../../helpers/data/prisoner-helper')
const expect = require('chai').expect

describe('services/data/get-travelling-from-and-to', function () {
  const REFERENCE = 'V123467'
  const EXPECTED_RESULT = {
    from: visitorHelper.TOWN,
    to: prisonerHelper.NAME_OF_PRISON
  }

  before(function () {
    return eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
  })

  it('should retrieve to and from information for the given reference', function () {
    getTravellingFromAndTo(REFERENCE)
      .then(function (result) {
        expect(result).to.deep.equal(EXPECTED_RESULT)
      })
  })

  after(function () {
    return eligiblityHelper.deleteEligibilityVisitorAndPrisoner(REFERENCE)
  })
})
