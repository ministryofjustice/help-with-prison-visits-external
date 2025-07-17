const prisonsEnum = require('../../constants/prisons-enum')
const benefitsEnum = require('../../constants/benefits-enum')
const prisonerRelationshipsEnum = require('../../constants/prisoner-relationships-enum')
const expenseTypeEnum = require('../../constants/expense-type-enum')
const enumHelper = require('../../constants/helpers/enum-helper')

module.exports.getPrisonerRelationshipDisplayName = value => {
  const element = enumHelper.getKeyByAttribute(prisonerRelationshipsEnum, value)
  return element.displayName
}

module.exports.getBenefitDisplayName = value => {
  const element = enumHelper.getKeyByAttribute(benefitsEnum, value)
  return element.displayName
}

module.exports.getBenefitRequireUpload = value => {
  const element = enumHelper.getKeyByAttribute(benefitsEnum, value)
  return element.requireBenefitUpload
}

module.exports.getBenefitMultipage = value => {
  const element = enumHelper.getKeyByAttribute(benefitsEnum, value)
  return element.multipage
}

module.exports.getPrisonDisplayName = value => {
  const element = enumHelper.getKeyByAttribute(prisonsEnum, value)
  return !element.displayName ? value : element.displayName
}

module.exports.getExpenseDisplayName = value => {
  const element = enumHelper.getKeyByAttribute(expenseTypeEnum, value)
  return element.displayName
}

module.exports.getExpenseReceiptRequired = value => {
  const element = enumHelper.getKeyByAttribute(expenseTypeEnum, value)
  return element.receiptRequired
}

const prisonsByRegion = {
  'ENG/WAL': {},
  SCO: {},
  NI: {},
  JSY: {},
  GSY: {},
  YCS: {},
}

Object.keys(prisonsEnum).forEach(prisonKey => {
  if (Object.hasOwn(prisonsEnum, prisonKey) && typeof prisonsEnum[prisonKey] === 'object') {
    prisonsByRegion[prisonsEnum[prisonKey].region][prisonKey] = prisonsEnum[prisonKey]
  }
})
// for (const prisonKey in prisonsEnum) {
//   if (Object.hasOwn(prisonsEnum, prisonKey)) {
//     const element = prisonsEnum[prisonKey]
//     if (typeof element === 'object') {
//       prisonsByRegion[element.region][prisonKey] = element
//     }
//   }
// }

module.exports.getPrisonsByRegion = region => {
  return prisonsByRegion[region]
}

module.exports.toCurrency = value => {
  let result = ''

  if (value < 0) {
    result += '-'
    value *= -1
  }

  if (value % 1 === 0) {
    result += `£${value}`
  } else {
    result += `£${Number(value).toFixed(2)}`
  }

  return result
}

module.exports.zeroCostWarning = (expenseType, cost, isAdvanceClaim) => {
  if (
    cost > 0 ||
    expenseType === expenseTypeEnum.CAR.value ||
    (expenseType === expenseTypeEnum.TRAIN.value && isAdvanceClaim)
  ) {
    return false
  }
  return true
}
