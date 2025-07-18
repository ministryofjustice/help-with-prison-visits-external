const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.VISITOR_ID = Math.floor(Date.now() / 100) - 15000000000
module.exports.FIRST_NAME = 'Fred'
module.exports.LAST_NAME = 'Smith'
module.exports.NATIONAL_INSURANCE_NUMBER = 'BN180518D'
module.exports.HOUSE_NUMBER_AND_STREET = '123 Street'
module.exports.TOWN = 'Belfast'
module.exports.COUNTY = 'Antrim'
module.exports.POST_CODE = 'BT137RT'
module.exports.COUNTRY = 'United Kingdom'
module.exports.EMAIL_ADDRESS = 'donotsend@apvs.com'
module.exports.PHONE_NUMBER = '02153245564'
module.exports.DAY = '22'
module.exports.MONTH = '11'
module.exports.YEAR = '1975'
module.exports.DATE_OF_BIRTH = dateFormatter.build(this.DAY, this.MONTH, this.YEAR)
module.exports.RELATIONSHIP = 'partner'
module.exports.JOURNEY_ASSISTANCE = 'yes'
module.exports.REQURE_BENEFIT_UPLOAD = false
module.exports.BENEFIT = 'income-support'
module.exports.BENEFIT_OWNER = 'yes'

module.exports.insert = (reference, eligibilityId) => {
  const db = getDatabaseConnector()

  return db('IntSchema.Visitor').insert({
    VisitorId: this.VISITOR_ID,
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: this.FIRST_NAME,
    LastName: this.LAST_NAME,
    NationalInsuranceNumber: this.NATIONAL_INSURANCE_NUMBER,
    HouseNumberAndStreet: this.HOUSE_NUMBER_AND_STREET,
    Town: this.TOWN,
    County: this.COUNTY,
    PostCode: this.POST_CODE,
    Country: this.COUNTRY,
    EmailAddress: this.EMAIL_ADDRESS,
    PhoneNumber: this.PHONE_NUMBER,
    DateOfBirth: this.DATE_OF_BIRTH.format('YYYY-MM-DD'),
    Relationship: this.RELATIONSHIP,
    Benefit: this.BENEFIT,
    BenefitOwner: this.BENEFIT_OWNER,
  })
}

module.exports.get = reference => {
  const db = getDatabaseConnector()

  return db.first().from('IntSchema.Visitor').where('Reference', reference)
}

module.exports.delete = reference => {
  const db = getDatabaseConnector()

  return db('IntSchema.Visitor').where('Reference', reference).del()
}
