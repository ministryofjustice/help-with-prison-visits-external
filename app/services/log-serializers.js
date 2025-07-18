module.exports.requestSerializer = request => {
  return {
    url: request.url,
    method: request.method,
    params: request.params,
  }
}

module.exports.responseSerializer = response => {
  return {
    statusCode: response.statusCode,
  }
}

module.exports.errorSerializer = error => {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
  }
}
