const moment = require('moment')

module.exports = function (status, isAdvance, dateOfJourney, updated) {
  var forEdit = false
  if (updated) {
    return forEdit
  }
  if (status === 'PENDING' || status === 'REQUEST-INFORMATION' || status === 'REQUEST-INFO-PAYMENT') {
    forEdit = true
  } else if (status === 'APPROVED' && isAdvance) {
    if (advanceEdit(dateOfJourney)) {
      forEdit = true
    }
  }
  return forEdit
}

function advanceEdit (dateOfJourney) {
  var advanceEdit = false
  var currentDate = moment()
  if (moment(dateOfJourney).isSameOrBefore(currentDate, 'day')) {
    advanceEdit = true
  }
  return advanceEdit
}
