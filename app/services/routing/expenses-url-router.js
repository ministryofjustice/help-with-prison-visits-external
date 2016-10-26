const URL_PARAMS = require('../../constants/expenses-url-path-enum')

// TODO: Split out the URL contruction logic.
// TODO: Explain what this class does.

const POST_EXPENSES_URL = 'summary'

module.exports.parseParams = function (queryParams) {
  return formatParams(buildParamsArrayFromObject(queryParams))
}

module.exports.getRedirectUrl = function (req) {
  if (!req || !req.body || !req.params || !req.params.reference || !req.params.claim || !req.originalUrl) {
    throw new Error('An error occured.')
  }

  if (req.body['add-another-journey']) {
    return req.originalUrl
  }
  var params = buildParamsArray(req.body.expenses, req.query)
  return buildUrl(params, req.params.reference, req.params.claim)
}

function buildParamsArray (expenseParams, queryParams) {
  var params = []
  if (expenseParams) {
    params = buildParamsArrayFromArray(expenseParams)
  }
  if (!isEmptyObject(queryParams)) {
    params = buildParamsArrayFromObject(queryParams)
  }
  return params
}

function buildParamsArrayFromArray (params) {
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

function buildParamsArrayFromObject (params) {
  var paramsArray = []
  for (var param in params) {
    paramsArray.push(param)
  }
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

// Remove the first param as we will be redirecting to this page.
function formatAndHandleLeadingParam (params) {
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

function buildUrl (params, referenceId, claimId) {
  return `/first-time-claim/eligibility/${referenceId}/claim/${claimId}/` + getPath(params) + formatAndHandleLeadingParam(params)
}

function isEmptyObject (object) {
  return Object.keys(object).length === 0 && object.constructor === Object
}
