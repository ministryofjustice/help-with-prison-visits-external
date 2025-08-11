const ExpenseTypeEnum = require('../../constants/expense-type-enum')
const ticketOwnerEnum = require('../../constants/ticket-owner-enum')
const displayHelper = require('./display-helper')

module.exports = expense => {
  let formattedDetail
  const travelTime = expense.TravelTime ? ` (${expense.TravelTime})` : ''

  switch (expense.ExpenseType) {
    case 'hire':
      formattedDetail = `${expense.From} to ${expense.To} for ${expense.DurationOfTravel} days`
      break
    case 'bus':
    case 'plane':
    case 'train':
      formattedDetail = `${addTicketOwnerPrefix(expense)}${expense.From} to ${expense.To}${travelTime}${addReturnPostfix(expense)}`
      break
    case 'refreshment':
      formattedDetail = ''
      break
    case 'accommodation':
      formattedDetail = `Nights stayed: ${expense.DurationOfTravel}`
      break
    case 'ferry':
      formattedDetail = `${addTicketOwnerPrefix(expense)}${expense.From} to ${expense.To} as ${ExpenseTypeEnum.FERRY.ticketType[expense.TicketType]}${addReturnPostfix(expense)}`
      break
    case 'car':
    case 'toll':
    case 'parking':
      formattedDetail = `${expense.From} to ${displayHelper.getPrisonDisplayName(expense.To)}`
      break
    default:
      formattedDetail = `${expense.From} to ${expense.To}`
  }

  return formattedDetail
}

function addTicketOwnerPrefix(expense) {
  let result = ''

  Object.keys(ticketOwnerEnum).forEach(ticketOwner => {
    if (ticketOwnerEnum[ticketOwner].value === expense.TicketOwner) {
      result = `${ticketOwnerEnum[ticketOwner].displayValue} - `
    }
  })

  // for (const ticketOwner in ticketOwnerEnum) {
  //   if (ticketOwnerEnum[ticketOwner].value === expense.TicketOwner) {
  //     result = `${ticketOwnerEnum[ticketOwner].displayValue} - `
  //   }
  // }

  return result
}

function addReturnPostfix(expense) {
  if (expense.IsReturn) {
    if (expense.ExpenseType === 'train' && expense.ReturnTime) {
      return ` - Return (${expense.ReturnTime})`
    }
    return ' - Return'
  }
  return ''
}
