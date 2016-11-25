const ERROR_MESSAGES = require('../services/validators/validation-error-messages')
const claimTypeEnum = require('../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/start', function (req, res) {
    return res.render('start')
  })

  router.post('/start', function (req, res) {
    if (!req.body.madeClaimForPrisonerBefore) {
      var errors = { invalidReferenceNumberAndDob: [ ERROR_MESSAGES.getMadeClaimForPrisonerBeforeIsRequired ] }
      return res.status(400).render('start', { errors: errors })
    } else if (req.body.madeClaimForPrisonerBefore === 'yes') {
      return res.redirect('/start-already-registered')
    } else {
      return res.redirect(`/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility`)
    }
  })
}
