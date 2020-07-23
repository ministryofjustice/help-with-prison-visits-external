const prisonsEnum = require('../../constants/prisons-enum')
const benefitsEnum = require('../../constants/benefits-enum')
const prisonerRelationshipsEnum = require('../../constants/prisoner-relationships-enum')
const expenseTypeEnum = require('../../constants/expense-type-enum')
const enumHelper = require('../../constants/helpers/enum-helper')

module.exports.getPrisonerRelationshipDisplayName = function (value) {
  var element = enumHelper.getKeyByAttribute(prisonerRelationshipsEnum, value)
  return element.displayName
}

module.exports.getBenefitDisplayName = function (value) {
  var element = enumHelper.getKeyByAttribute(benefitsEnum, value)
  return element.displayName
}

module.exports.getBenefitRequireUpload = function (value) {
  var element = enumHelper.getKeyByAttribute(benefitsEnum, value)
  return element.requireBenefitUpload
}

module.exports.getBenefitMultipage = function (value) {
  var element = enumHelper.getKeyByAttribute(benefitsEnum, value)
  return element.multipage
}

module.exports.getPrisonDisplayName = function (value) {
  var element = enumHelper.getKeyByAttribute(prisonsEnum, value)
  return !element.displayName ? value : element.displayName
}

module.exports.getExpenseDisplayName = function (value) {
  var element = enumHelper.getKeyByAttribute(expenseTypeEnum, value)
  return element.displayName
}

module.exports.getExpenseReceiptRequired = function (value) {
  var element = enumHelper.getKeyByAttribute(expenseTypeEnum, value)
  return element.receiptRequired
}

var prisonsByRegion = {
  'ENG/WAL': {},
  SCO: {},
  NI: {},
  JSY: {},
  GSY: {}
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
  var result = ''

  if (value < 0) {
    result += '-'
    value = value * -1
  }

  if (value % 1 === 0) {
    result += `£${value}`
  } else {
    result += `£${Number(value).toFixed(2)}`
  }

  return result
}

module.exports.zeroCostWarning = function (expenseType, cost, isAdvanceClaim) {
  if (cost > 0 || expenseType === expenseTypeEnum.CAR.value || (expenseType === expenseTypeEnum.TRAIN.value && isAdvanceClaim)) {
    return false
  }
  return true
}
