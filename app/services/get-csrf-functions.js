const { doubleCsrf } = require('csrf-csrf')
const config = require('../../config')

module.exports = doubleCsrf({
  getSecret: () => config.EXT_APPLICATION_SECRET,
  getSessionIdentifier: req => req.session.csrfId,
  getCsrfTokenFromRequest: req => {
    // eslint-disable-next-line no-underscore-dangle
    return req.body?._csrf
  },
  cookieName: 'apvs-csrf',
  cookieOptions: { secure: config.EXT_SECURE_COOKIE === 'true' },
})
