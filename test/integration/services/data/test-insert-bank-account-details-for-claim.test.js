const { expect } = require('chai')
const insertBankAccountDetailsForClaim = require('../../../../app/services/data/insert-bank-account-details-for-claim')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const bankHelper = require('../../../helpers/data/bank-helper')

describe('services/data/insert-bank-account-details-for-claim', () => {
  const REFERENCE = 'V123456'
  let eligibilityId
  let claimId

  before(() => {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE).then(function (ids) {
      eligibilityId = ids.eligibilityId
      claimId = ids.claimId
    })
  })

  it('should insert a new Bank Details record for a claim', () => {
    return insertBankAccountDetailsForClaim(REFERENCE, eligibilityId, claimId, bankHelper.build())
      .then(() => {
        return bankHelper.get(claimId)
      })
      .then(function (bank) {
        expect(bank.AccountNumber).to.equal(bankHelper.ACCOUNT_NUMBER)
        expect(bank.SortCode).to.equal(bankHelper.SORT_CODE)
        expect(bank.RollNumber).to.equal(bankHelper.ROLL_NUMBER)
        expect(bank.NameOnAccount).to.equal(bankHelper.NAME_ON_ACCOUNT)
      })
  })

  it('should throw error if called with incorrect domain object type', () => {
    expect(() => {
      insertBankAccountDetailsForClaim(REFERENCE, eligibilityId, claimId, {})
    }).to.throw(Error)
  })

  after(() => {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
