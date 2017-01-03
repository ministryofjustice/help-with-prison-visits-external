module.exports = {
  setVisitDate: setVisitDate
}

function setVisitDate (requestParams, context, ee, next) {
  requestParams.body['date-of-journey-day'] = '01'
  requestParams.body['date-of-journey-month'] = '01'
  requestParams.body['date-of-journey-year'] = '2017'
  return next()
}
