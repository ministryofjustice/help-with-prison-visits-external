const claimTypeEnum = require('../../constants/claim-type-enum')
const benefitsEnum = require('../../constants/benefits-enum')
const prisonerRelationshipEnum = require('../../constants/prisoner-relationships-enum')
const enumHelper = require('../../constants/helpers/enum-helper')
const dateFormatter = require('../../services/date-formatter')
const moment = require('moment')

module.exports = function (claimType, referenceId, dateOfBirth, benefit, relationship) {
  if (claimType === claimTypeEnum.FIRST_TIME) {
    var encodedDOB = dateFormatter.encodeDate(moment(dateOfBirth))
    var benefitURLValue = enumHelper.getKeyByAttribute(benefitsEnum, benefit).urlValue
    var relationshipURLValue = enumHelper.getKeyByAttribute(prisonerRelationshipEnum, relationship).urlValue
    return `/apply/${claimType}/new-eligibility/${encodedDOB}/${relationshipURLValue}/${benefitURLValue}/${referenceId}`
  } else {
    return '/your-claims/check-your-information'
  }
}
