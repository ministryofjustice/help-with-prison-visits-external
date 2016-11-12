const expect = require('chai').expect
const insertBankAccountDetailsForClaim = require('../../../../app/services/data/insert-bank-account-details-for-claim')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const bankHelper = require('../../../helpers/data/bank-helper')

describe('services/data/insert-bank-account-details-for-claim', function () {
  const REFERENCE = 'V123456'
  var eligibilityId
  var claimId

  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should insert a new Bank Details record for a claim', function () {
    return insertBankAccountDetailsForClaim(REFERENCE, eligibilityId, claimId, bankHelper.build())
      .then(function () {
        return bankHelper.get(claimId)
      })
      .then(function (bank) {
        expect(bank.AccountNumber).to.equal(bankHelper.ACCOUNT_NUMBER)
        expect(bank.SortCode).to.equal(bankHelper.SORT_CODE)
      })
  })

  it('should throw error if called with incorrect domain object type', function () {
    expect(function () {
      insertBankAccountDetailsForClaim(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
