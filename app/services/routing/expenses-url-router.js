/**
 * A custom router that returns a redirection URL based upon a set of path params (defined in expenses-url-path-enum.js).
 */
const paramBuilder = require('./param-builder')
const POST_EXPENSES_PATH = 'summary'
const ROUTING_ERROR = new Error('An error occured.')

module.exports.parseParams = function (params) {
  return paramBuilder.buildFormatted(toArray(params))
}

module.exports.getRedirectUrl = function (req) {
  if (!isValid(req)) {
    throw ROUTING_ERROR
  }

  if (req.body['add-another-journey']) {
    return req.originalUrl
  }
  var params = getParams(req.body.expenses, toArray(req.query))
  return buildUrl(params, req.session.claimType, req.session.referenceId, req.session.claimId)
}

function getParams (expenseParams, queryParams) {
  var params = []

  if (!(expenseParams instanceof Array)) {
    expenseParams = [expenseParams]
  }

  if (!isEmpty(expenseParams)) {
    params = paramBuilder.build(expenseParams)
  }
  if (!isEmpty(queryParams)) {
    params = paramBuilder.build(queryParams)
  }
  return params
}

function getPath (params) {
  return params[0] ? params[0] : POST_EXPENSES_PATH
}

// Shift the array to remove the first param as we will be redirecting to this page.
function buildUrl (params, claimType, referenceId, claimId) {
  var path = getPath(params)
  params.shift()
  return `/apply/eligibility/claim/${path}${paramBuilder.format(params)}`
}

function isValid (req) {
  return req && req.body && req.query && req.originalUrl && req.params && req.session.claimType && req.session.referenceId && req.session.claimId
}

function isEmpty (array) {
  return !array || array.length === 0
}

function toArray (object) {
  return Object.keys(object)
}
