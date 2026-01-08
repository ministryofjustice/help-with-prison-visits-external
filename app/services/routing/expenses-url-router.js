/**
 * A custom router that returns a redirection URL based upon a set of path params (defined in expenses-url-path-enum.js).
 */
const paramBuilder = require('./param-builder')

const POST_EXPENSES_PATH = 'summary'
const ROUTING_ERROR = new Error('An error occured.')

module.exports.parseParams = params => {
  if (params) {
    return paramBuilder.buildFormatted(toArray(params))
  }

  return ''
}

module.exports.getRedirectUrl = req => {
  if (!isValid(req)) {
    throw ROUTING_ERROR
  }

  if (req.body?.['add-another-journey']) {
    return req.originalUrl
  }
  let expenses = req.body?.expenses

  if (typeof req.body?.expenses === 'object') {
    expenses = toArray(req.body.expenses)
  }
  const params = getParams(expenses, toArray(req.query))
  return buildUrl(params, req.session.claimType, req.session.referenceId, req.session.claimId)
}

function getParams(expenseParams, queryParams) {
  let params = []

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

function getPath(params) {
  return params[0] ? params[0] : POST_EXPENSES_PATH
}

// Shift the array to remove the first param as we will be redirecting to this page.
function buildUrl(params, _claimType, _referenceId, _claimId) {
  const path = getPath(params)
  params.shift()
  return `/apply/eligibility/claim/${path}${paramBuilder.format(params)}`
}

function isValid(req) {
  return (
    req &&
    req.body &&
    req.query &&
    req.originalUrl &&
    req.params &&
    req.session.claimType &&
    req.session.referenceId &&
    req.session.claimId
  )
}

function isEmpty(array) {
  return !array || array.length === 0
}

function toArray(object) {
  return Object.keys(object)
}
