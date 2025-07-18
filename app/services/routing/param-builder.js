/**
 * Exposes functions to build and format the query paramaters of a URL, suitable for redirection using Express.
 */
const URL_PARAMS = require('../../constants/expenses-url-path-enum')

module.exports.format = params => {
  let queryString = ''
  if (!isEmpty(params)) {
    queryString = '?'
    params.forEach(param => {
      queryString += `${param}=&`
    })
  }
  return queryString.replace(/&$/, '')
}

module.exports.build = params => {
  const paramsArray = []
  if (params) {
    params.forEach(param => {
      if (URL_PARAMS.includes(param)) {
        paramsArray.push(param)
      }
    })
  }
  return paramsArray
}

module.exports.buildFormatted = params => {
  return this.format(this.build(params))
}

function isEmpty(array) {
  return !array || array.length === 0
}
