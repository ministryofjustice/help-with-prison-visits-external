const expect = require('chai').expect
const moment = require('moment')
const bases = require('bases')
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const prisonerRelationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')
const getChangeAddressLink = require('../../../../app/routes/helpers/get-change-address-link')

const REFERENCE_ID = '018978472941'
const DATE_OF_BIRTH = new Date('10-10-1990')
const ENCODED_DATE = bases.toBase8(moment(DATE_OF_BIRTH).format('YYYYMMDD'))
const FIRST_TIME_LINK = `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/${ENCODED_DATE}/${prisonerRelationshipEnum.PARTNER.urlValue}/${benefitsEnum.INCOME_SUPPORT.urlValue}/${REFERENCE_ID}`
const REPEAT_LINK = '/your-claims/check-your-information'

describe('routes/helpers/get-change-address-link', function () {
  it('should return link for first time claim', function () {
    expect(getChangeAddressLink(claimTypeEnum.FIRST_TIME, REFERENCE_ID, DATE_OF_BIRTH, benefitsEnum.INCOME_SUPPORT.value, prisonerRelationshipEnum.PARTNER.value)).to.equal(FIRST_TIME_LINK)
  })

  it('should return link for repeat claims', function () {
    expect(getChangeAddressLink(claimTypeEnum.REPEAT)).to.equal(REPEAT_LINK)
  })
})
