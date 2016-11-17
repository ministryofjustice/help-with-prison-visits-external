const PrisonerRelationship = require('../../../services/domain/prisoner-relationship')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const ValidationError = require('../../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)
    return res.render('apply/new-eligibility/prisoner-relationship', {
      claimType: req.params.claimType,
      dob: req.params.dob
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob', function (req, res) {
    UrlPathValidator(req.params)

    var relationship = req.body.relationship
    var dob = req.params.dob

    try {
      var prisonerRelationship = new PrisonerRelationship(relationship)

      if (prisonerRelationship.relationship === 'none') {
        return res.redirect('/eligibility-fail')
      } else {
        return res.redirect(`/apply/${req.params.claimType}/new-eligibility/${dob}/${prisonerRelationship.relationship}`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/prisoner-relationship', {
          errors: error.validationErrors,
          dob: dob
        })
      } else {
        throw error
      }
    }
  })
}