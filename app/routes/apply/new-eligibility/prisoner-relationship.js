const PrisonerRelationship = require('../../../services/domain/prisoner-relationship')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const claimTypeEnum = require('../../../constants/claim-type-enum')
const prisonerRelationshipEnum = require('../../../constants/prisoner-relationships-enum')

const REFERENCE_SESSION_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/prisoner-relationship', function (req, res) {
    UrlPathValidator(req.params)

    if (req.params.claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
      if (!req.session ||
          !req.session.dobEncoded ||
          !req.session.dobDecoded ||
          !req.session.encryptedRef ||
          !req.session.decryptedRef ||
          !req.session.prisonerNumber) {
        return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
      }
    } else {
      if (!req.session ||
          !req.session.dobEncoded) {
        return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
      }
    }

    req.session.claimType = req.params.claimType

    return res.render('apply/new-eligibility/prisoner-relationship', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/prisoner-relationship', function (req, res) {
    UrlPathValidator(req.params)

    if (req.params.claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
      if (!req.session ||
          !req.session.dobEncoded ||
          !req.session.dobDecoded ||
          !req.session.encryptedRef ||
          !req.session.decryptedRef ||
          !req.session.prisonerNumber) {
        return res.redirect(`/start-already-registered${REFERENCE_SESSION_ERROR}`)
      }
    } else {
      if (!req.session ||
          !req.session.dobEncoded) {
        return res.redirect(`/apply/first-time/new-eligibility/date-of-birth${REFERENCE_SESSION_ERROR}`)
      }
    }

    req.session.claimType = req.params.claimType

    try {
      var prisonerRelationship = new PrisonerRelationship(req.body.relationship)

      var relationship = prisonerRelationship.relationship
      req.session.relationship = relationship

      if (relationship === prisonerRelationshipEnum.NONE.urlValue) {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/benefits`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/prisoner-relationship', {
          errors: error.validationErrors,
          URL: req.url
        })
      } else {
        throw error
      }
    }
  })
}
