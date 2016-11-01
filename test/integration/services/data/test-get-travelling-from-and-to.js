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

  before(function (done) {
    eligiblityHelper.insertEligibilityVisitorAndPrisoner(REFERENCE)
      .then(function () {
        done()
      })
  })

  it('should retrieve to and from information for the given reference', function (done) {
    getTravellingFromAndTo(REFERENCE)
      .then(function (result) {
        expect(result).to.deep.equal(EXPECTED_RESULT)
        done()
      })
  })

  after(function (done) {
    eligiblityHelper.deleteEligibilityVisitorAndPrisoner(REFERENCE)
      .then(function () {
        done()
      })
  })
})
