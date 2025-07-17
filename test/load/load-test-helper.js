const fs = require('fs')

module.exports = {
  setVisitDate,
  attachImageFile,
}

// Date of visit needs to be dynamically set to a recent day in the past
function setVisitDate(requestParams, _context, _ee, _next) {
  const dateOfVisit = new Date()
  dateOfVisit.setDate(dateOfVisit.getDate() - 7)

  requestParams.json['date-of-journey-day'] = dateOfVisit.getDate()
  requestParams.json['date-of-journey-month'] = dateOfVisit.getMonth() + 1
  requestParams.json['date-of-journey-year'] = dateOfVisit.getFullYear()

  return null
}

// Load the dummy visit confirmation or receipt image from disk and add to form data
function attachImageFile(requestParams, context, _ee, _next) {
  requestParams.formData._csrf = context.vars.token.value // eslint-disable-line no-underscore-dangle
  const imageContents = fs.createReadStream('./data/visit-confirmation.jpg')
  requestParams.formData.document = imageContents
  return null
}
