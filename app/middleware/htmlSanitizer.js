const sanitizeHtml = require('sanitize-html')
const _ = require('underscore')

/**
 * Simple middleware that wraps sanitizer and can be exposed
 * at the app.use router layer and apply to all methods.
 * This is best used for APIs where it is very unlikely
 * you would need to pass back and forth html entities
 *
 * @return {Function}
 * @api public
 *
 */
module.exports = function htmlSanitizerMiddleware () {
  return function expressSanitized (req, res, next) {
    [req.body, req.query].forEach(function (val, ipar, request) {
      if (_.size(val)) {
        _.each(val, function (val, ichild) {
          if (val) {
            // strings
            if (_.isString(val)) {
              request[ipar][ichild] = sanitizeHtml(val)
            }

            // arrays and objects
            if (_.isArray(val) || _.isObject(val)) {
              request[ipar][ichild] = sanitizeObject(val)
            }
          }
        })
      }
    })

    next()
  }
}

function sanitizeObject (val) {
  try {
    const clean = sanitizeHtml(JSON.stringify(val))
    return JSON.parse(clean)
  } catch (e) {
    return val
  }
}
