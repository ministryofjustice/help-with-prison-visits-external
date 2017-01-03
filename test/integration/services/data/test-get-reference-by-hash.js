const expect = require('chai').expect
const referenceChecker = require('../../../../app/services/data/get-reference-by-hash')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const UNHASHED_REF = 'REFCHECK'

var referenceHash

describe('services/helpers/reference-checker', function () {
  before(function () {
    return eligiblityHelper.insertEligibilityWithHash(UNHASHED_REF)
      .then(function (ids) {
        referenceHash = ids.referenceHash
      })
  })

  it('should return true if unhashed ref and hashed ref match', function () {
    return referenceChecker(referenceHash)
      .then(function (result) {
        expect(result.reference).to.equal(UNHASHED_REF)
        expect(result.isValid).to.be.true
      })
  })

  it('should return false if unhashed ref and hashed ref do not match', function () {
    return referenceChecker('referenceHash')
      .then(function (result) {
        expect(result.reference).to.be.null
        expect(result.isValid).to.be.false
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(UNHASHED_REF)
  })
})
