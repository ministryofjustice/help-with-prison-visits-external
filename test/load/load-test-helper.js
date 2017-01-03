module.exports = {
  setVisitDate: setVisitDate
}

// Date of visit needs to be dynamically set to a recent day in the past
function setVisitDate (requestParams, context, ee, next) {
  var dateOfVisit = new Date()
  dateOfVisit.setDate(dateOfVisit.getDate() - 7)

  requestParams.json['date-of-journey-day'] = dateOfVisit.getDate()
  requestParams.json['date-of-journey-month'] = (dateOfVisit.getMonth() + 1)
  requestParams.json['date-of-journey-year'] = dateOfVisit.getFullYear()

  return next()
}
