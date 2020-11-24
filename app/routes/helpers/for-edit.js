const moment = require('moment')

module.exports = function (status, isAdvance, dateOfJourney, updated) {
  let forEdit = false
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
  let advanceEdit = false
  const currentDate = moment()
  if (moment(dateOfJourney).isSameOrBefore(currentDate, 'day')) {
    advanceEdit = true
  }
  return advanceEdit
}
