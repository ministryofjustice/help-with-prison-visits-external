const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const claimTypeEnum = require('../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/start', function (req, res) {
    var errors

    if ((req.query.error === 'expired')) {
      req.session.dobEncoded = null
      req.session.relationship = null
      req.session.benefit = null
      req.session.referenceId = null
      req.session.decryptedRef = null
      req.session.claimType = null
      req.session.advanceOrPast = null
      req.session.claimId = null
      req.session.advanceOrPast = null

      errors = { expired: [ ERROR_MESSAGES.getExpiredSession ] }
    }

    return res.render('start', { errors: errors, recovery: req.query.recovery })
  })

  router.post('/start', function (req, res) {
    if (!req.body.madeClaimForPrisonerBefore) {
      var errors = { invalidReferenceNumberAndDob: [ ERROR_MESSAGES.getMadeClaimForPrisonerBeforeIsRequired ] }
      return res.status(400).render('start', { errors: errors })
    } else if (req.body.madeClaimForPrisonerBefore === 'yes') {
      return res.redirect('/start-already-registered')
    } else {
      return res.redirect(`/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth`)
    }
  })
}
