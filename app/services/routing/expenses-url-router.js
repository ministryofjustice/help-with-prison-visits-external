const URL_PARAMS = require('../../constants/expenses-url-path-enum')

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
  var queryParams = req.query

  console.log('ROUTER - Expense Params:')
  console.log(expenseParams)

  console.log('ROUTER - Query Params:')
  console.log(queryParams)

  var params = []
  if (expenseParams) {
    params = expenseParams
  } else if (queryParams) {
    params = queryParams
  }
  return buildUrl(params, referenceId, claimId)
}

function buildUrl (params, referenceId, claimId) {
  var paramsArray = buildParameterArray(params)
  return `/first-time-claim/eligibility/${referenceId}/claim/${claimId}/` + getPath(paramsArray) + formatParams(paramsArray)
}

function buildParameterArray (params) {
  var paramsArray = []

  if (!(params instanceof Array)) {
    params = [params]
  }

  params.forEach(function (param) {
    if (URL_PARAMS.includes(param)) {
      paramsArray.push(param)
    }
  })
  return paramsArray
}

function getPath (params) {
  var firstParam = params[0]
  if (firstParam) {
    return firstParam
  } else {
    return POST_EXPENSES_URL
  }
}

function formatParams (params) {
  var queryString = ''
  if (params) {
    queryString = '?'
    params.forEach(function (param) {
      queryString += param + '=&'
    })
  }
  return queryString
}
