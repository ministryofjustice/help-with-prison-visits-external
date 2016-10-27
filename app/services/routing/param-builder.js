/**
 * Exposes functions to build and format the query paramaters of a URL, suitable for redirection using Express.
 */
const URL_PARAMS = require('../../constants/expenses-url-path-enum')

module.exports.format = function (params) {
  var queryString = ''
  if (!isEmpty(params)) {
    queryString = '?'
    params.forEach(function (param) {
      queryString += param + '=&'
    })
  }
  return queryString.replace(/&$/, '')
}

module.exports.build = function (params) {
  var paramsArray = []
  params.forEach(function (param) {
    if (URL_PARAMS.includes(param)) {
      paramsArray.push(param)
    }
  })
  return paramsArray
}

function isEmpty (array) {
  return !array || array.length === 0
}
