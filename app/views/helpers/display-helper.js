const prisonsEnum = require('../../constants/prisons-enum')
const benefitsEnum = require('../../constants/benefits-enum')
const prisonerRelationshipsEnum = require('../../constants/prisoner-relationships-enum')
const expenseTypeEnum = require('../../constants/expense-type-enum')
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

module.exports.getExpenseDisplayName = function (value) {
  var element = enumHelper.getKeyByValue(expenseTypeEnum, value)
  return element.displayName
}

module.exports.getExpenseReceiptRequired = function (value) {
  var element = enumHelper.getKeyByValue(expenseTypeEnum, value)
  return element.receiptRequired
}

var prisonsByRegion = {
  'ENG/WAL': {},
  'SCO': {},
  'NI': {},
  'JSY': {},
  'GSY': {}
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

module.exports.toCurrency = function (value) {
  if (value && value < 0) {
    return `-£${Number(value * -1).toFixed(2)}`
  } else {
    return `£${Number(value).toFixed(2)}`
  }
}
