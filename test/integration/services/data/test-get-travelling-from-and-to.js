const getTravellingFromAndTo = require('../../../../app/services/data/get-travelling-from-and-to')
const eligiblityHelper = require('../../helpers/data/eligibility-helper')
const visitorHelper = require('../../helpers/data/visitor-helper')
const prisonerHelper = require('../../helpers/data/prisoner-helper')
const expect = require('chai').expect

describe('services/data/get-travelling-from-and-to', function () {
  const EXPECTED_RESULT = {
    from: visitorHelper.TOWN,
    to: prisonerHelper.NAME_OF_PRISON
  }

  before(function (done) {
    eligiblityHelper.insertEligibilityVisitorAndPrisoner()
      .then(function () {
        done()
      })
  })

  it('should retrieve to and from information for the given reference', function (done) {
    getTravellingFromAndTo(eligiblityHelper.REFERENCE)
      .then(function (result) {
        expect(result).to.deep.equal(EXPECTED_RESULT)
        done()
      })
  })

  after(function (done) {
    eligiblityHelper.deleteEligibilityVisitorAndPrisoner()
      .then(function () {
        done()
      })
  })
})
