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
    case 'train':
      if (expense.IsReturn) {
        formattedDetail = `${expense.From} to ${expense.To} - Return`
      } else {
        formattedDetail = `${expense.From} to ${expense.To}`
      }
      break
    case 'light refreshment':
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
      formattedDetail = `${expense.From} to ${expense.To} as ${displayFieldNames[expense.TicketType]}`
      break
    default:
      formattedDetail = `${expense.From} to ${expense.To}`
  }

  return formattedDetail
}
