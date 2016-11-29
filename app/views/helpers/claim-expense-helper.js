const displayFieldNames = require('./display-field-names')

module.exports.DisplayName = function (expense) {
  return displayFieldNames[expense.ExpenseType]
}

module.exports.FormattedDetail = function (expense) {
  var formattedDetail

  switch (expense.ExpenseType) {
    case 'car hire':
      formattedDetail = `${expense.From} to ${expense.To} for ${expense.DurationOfTravel} days`
      break
    case 'bus':
    case 'plane':
    case 'train':
      formattedDetail = `${addChildPrefix(expense)}${expense.From} to ${expense.To}${addReturnPostfix(expense)}`
      break
    case 'refreshment':
      if (expense.TravelTime === 'over-five') {
        formattedDetail = 'Over five hours away but under ten hours'
      } else {
        formattedDetail = 'Over ten hours away'
      }
      break
    case 'accommodation':
      formattedDetail = `Nights stayed: ${expense.DurationOfTravel}`
      break
    case 'ferry':
      formattedDetail = `${addChildPrefix(expense)}${expense.From} to ${expense.To} as ${displayFieldNames[expense.TicketType]}${addReturnPostfix(expense)}`
      break
    default:
      formattedDetail = `${expense.From} to ${expense.To}`
  }

  return formattedDetail
}

function addChildPrefix (expense) {
  if (expense.IsChild) {
    return 'Child - '
  } else {
    return ''
  }
}

function addReturnPostfix (expense) {
  if (expense.IsReturn) {
    return ' - Return'
  } else {
    return ''
  }
}
