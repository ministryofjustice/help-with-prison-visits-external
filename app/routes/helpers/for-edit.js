const moment = require('moment')

module.exports = function (status, isAdvance, dateOfJourney) {
  var forEdit = false
  if (status === 'PENDING' || status === 'REQUEST-INFORMATION') {
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
