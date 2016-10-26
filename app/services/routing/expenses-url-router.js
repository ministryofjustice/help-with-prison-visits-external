const URL_PARAMS = require('../../constants/expenses-url-path-enum')

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

  var expenseParams = req.body.expenses
  var queryParams = req.query

  console.log('ROUTER - Expense Params:')
  console.log(expenseParams)

  console.log('ROUTER - Query Params:')
  console.log(queryParams)

  var params = []
  if (expenseParams) {
    params = buildParamArrayFromArray(expenseParams)
  } else if (queryParams) {
    params = buildParamArrayFromObject(queryParams)
  }
  return buildUrl(params, referenceId, claimId)
}

function buildUrl (params, referenceId, claimId) {
  return `/first-time-claim/eligibility/${referenceId}/claim/${claimId}/` + getPath(params) + formatAndHandleLeadingParam(params)
}

function buildParamArrayFromArray (params) {
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

function formatAndHandleLeadingParam (params) {
  // TODO: Do this only if the user did NOT set add another journey to true.
  // Remove the first param as we will be redirecting to this page.
  params.shift()
  return formatParams(params)
}

function formatParams (params) {
  var queryString = ''
  if (params && params.length > 0) {
    queryString = '?'
    params.forEach(function (param) {
      queryString += param + '=&'
    })
  }
  return queryString.replace(/&$/, '')
}

function buildParamArrayFromObject (params) {
  var paramsArray = []
  for (var param in params) {
    paramsArray.push(param)
  }
  return paramsArray
}

module.exports.parseParams = function (queryParams) {
  return formatParams(buildParamArrayFromObject(queryParams))
}
