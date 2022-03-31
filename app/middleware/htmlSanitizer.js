const sanitizeHtml = require('sanitize-html')

/*
  Based on https://github.com/askhogan/express-sanitized which is no longer maintained
*/
module.exports = () => {
  return (req, res, next) => {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key]

      if (typeof value === 'string') {
        req.body[key] = sanitizeHtml(value)
      }

      if (typeof value === 'object') {
        req.body[key] = sanitizeObject(value)
      }
    })

    Object.keys(req.query).forEach((key) => {
      const value = req.query[key]

      if (typeof value === 'string') {
        req.query[key] = sanitizeHtml(value)
      }

      if (typeof value === 'object') {
        req.query[key] = sanitizeObject(value)
      }
    })

    next()
  }
}

const sanitizeObject = (value) => {
  try {
    const sanitized = sanitizeHtml(JSON.stringify(value))
    return JSON.parse(sanitized)
  } catch (e) {
    return value
  }
}
