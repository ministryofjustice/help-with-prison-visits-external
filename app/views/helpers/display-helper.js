const prisonsEnum = require('../../constants/prisons-enum')
const benefitsEnum = require('../../constants/benefits-enum')
const prisonerRelationshipsEnum = require('../../constants/prisoner-relationships-enum')
const enumHelper = require('../../constants/helpers/enum-helper')

module.exports.getPrisonerRelationshipDisplayName = function (value) {
  var element = enumHelper.getKeyByValue(prisonerRelationshipsEnum, value)
  return element.displayName
}

module.exports.getBenefitDisplayName = function (value) {
  var element = enumHelper.getKeyByValue(benefitsEnum, value)
  return element.displayName
}

module.exports.getBenefitRequireUpload = function (value) {
  var element = enumHelper.getKeyByValue(benefitsEnum, value)
  return element.requireBenefitUpload
}

module.exports.getBenefitMultipage = function (value) {
  var element = enumHelper.getKeyByValue(benefitsEnum, value)
  return element.multipage
}

module.exports.getPrisonDisplayName = function (value) {
  var element = enumHelper.getKeyByValue(prisonsEnum, value)
  return element.displayName
}

var prisonsByRegion = {
  'ENG/WAL': {},
  'SCO': {},
  'NI': {}
}

for (var prisonKey in prisonsEnum) {
  var element = prisonsEnum[prisonKey]
  if (typeof element === 'object') {
    prisonsByRegion[element.region][prisonKey] = element
  }
}

module.exports.getPrisonsByRegion = function (region) {
  return prisonsByRegion[region]
}
