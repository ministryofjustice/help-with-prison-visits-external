const moment = require('moment')

module.exports = (status, isAdvance, dateOfJourney, updated) => {
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

function advanceEdit(dateOfJourney) {
  let doAdvanceEdit = false
  const currentDate = moment()
  if (moment(dateOfJourney).isSameOrBefore(currentDate, 'day')) {
    doAdvanceEdit = true
  }
  return doAdvanceEdit
}
