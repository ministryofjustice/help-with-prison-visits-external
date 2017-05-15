const PrisonerRelationship = require('../../../services/domain/prisoner-relationship')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../constants/prisoner-relationships-enum')
const SessionValidator = require('../../../services/validators/session-validator')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/prisoner-relationship', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    return res.render('apply/new-eligibility/prisoner-relationship', {
      URL: req.url
    })
  })

  router.post('/apply/:claimType/new-eligibility/prisoner-relationship', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

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
