const ExpenseTypeEnum = require('../../constants/expense-type-enum')
const ticketOwnerEnum = require('../../constants/ticket-owner-enum')
const displayHelper = require('./display-helper')

module.exports = function (expense) {
  var formattedDetail

  switch (expense.ExpenseType) {
    case 'hire':
      formattedDetail = `${expense.From} to ${expense.To} for ${expense.DurationOfTravel} days`
      break
    case 'bus':
    case 'plane':
    case 'train':
      formattedDetail = `${addTicketOwnerPrefix(expense)}${expense.From} to ${expense.To}${addReturnPostfix(expense)}`
      break
    case 'refreshment':
      if (expense.TravelTime === 'over-five') {
        formattedDetail = 'Over 5 hours away but under ten hours'
      } else {
        formattedDetail = 'Over 10 hours away'
      }
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

function addTicketOwnerPrefix (expense) {
  var result = ''

  for (var ticketOwner in ticketOwnerEnum) {
    if (ticketOwnerEnum[ticketOwner].value === expense.TicketOwner) {
      result = ticketOwnerEnum[ticketOwner].displayValue + ' - '
    }
  }

  return result
}

function addReturnPostfix (expense) {
  if (expense.IsReturn) {
    return ' - Return'
  } else {
    return ''
  }
}
