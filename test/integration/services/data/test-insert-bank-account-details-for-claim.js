const expect = require('chai').expect
const insertBankAccountDetailsForClaim = require('../../../../app/services/data/insert-bank-account-details-for-claim')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const claimHelper = require('../../../helpers/data/claim-helper')
const bankHelper = require('../../../helpers/data/bank-helper')

describe('services/data/insert-bank-account-details-for-claim', function () {
  const REFERENCE = 'V123456'

  before(function () {
    return eligiblityHelper.insert(REFERENCE)
      .then(function () {
        return claimHelper.insert(REFERENCE)
      })
  })

  it('should insert a new Bank Details record for a claim', function () {
    return insertBankAccountDetailsForClaim(claimHelper.CLAIM_ID, bankHelper.build())
      .then(function () {
        return bankHelper.get(claimHelper.CLAIM_ID)
      })
      .then(function (bank) {
        expect(bank.AccountNumber).to.equal(bankHelper.ACCOUNT_NUMBER)
        expect(bank.SortCode).to.equal(bankHelper.SORT_CODE)
      })
  })

  it('should throw error if called with incorrect domain object type', function () {
    expect(function () {
      insertBankAccountDetailsForClaim(claimHelper.CLAIM_ID, {})
    }).to.throw(Error)
  })

  after(function () {
    return bankHelper.delete(claimHelper.CLAIM_ID)
      .then(function () {
        return claimHelper.delete(claimHelper.CLAIM_ID)
      })
      .then(function () {
        return eligiblityHelper.delete(REFERENCE)
      })
  })
})
