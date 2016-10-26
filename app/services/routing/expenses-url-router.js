const URL_PARAMS = require('../../constants/expenses-url-params-enums')

// TODO: Only add a paramater if we are NOT redirecting to that page.
// TODO: Need to handle add another journey being selected. Will need to know which page this was selected on.
// TODO: Split out the URL contruction logic.
// TODO: Explain what this class does.

const POST_EXPENSES_URL = 'summary'

module.exports.getRedirectUrl = function (req) {
  if (!req || !req.body || !req.params || !req.params.reference || !req.params.claim) {
    throw new Error('An error occured.')
  }

  // The parameters to append to the URL.
  var referenceId = req.params.reference
  var claimId = req.params.claim

  // TODO should pass either the expense params OR the query params. whichever is set.
  var expenseParams = req.body.expenses
  // var queryParams = req.params

  return buildUrl(expenseParams, referenceId, claimId)
}

function buildUrl (queryParams, referenceId, claimId) {
  var params = buildParameterArray(queryParams)
  return `/first-time-claim/eligibility/${referenceId}/claim/${claimId}/` + getPath(params) + parseParams(params)
}

function buildParameterArray (queryParams) {
  var params = []

  if (!(queryParams instanceof Array)) {
    queryParams = [queryParams]
  }

  queryParams.forEach(function (param) {
    if (URL_PARAMS.includes(param)) {
      params.push(param)
    }
  })
  return params
}

function getPath (params) {
  var firstParam = params[0]
  if (firstParam) {
    return firstParam
  } else {
    return POST_EXPENSES_URL
  }
}

function parseParams (params) {
  var queryStrings = ''
  if (params) {
    queryStrings = '?'
    params.forEach(function (param) {
      queryStrings += param + '=&'
    })
  }
  return queryStrings
}
