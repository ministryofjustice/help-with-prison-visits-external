const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasChild = require('../../../../services/domain/has-child')
const ValidationError = require('../../../../services/errors/validation-error')
const SessionValidator = require('../../../../services/validators/session-validator')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/has-child', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    return res.render('apply/eligibility/claim/has-child', {
      claimType: req.session.claimType,
      referenceId: req.session.referenceId,
      claimId: req.session.claimId
    })
  })

  router.post('/apply/eligibility/claim/has-child', function (req, res) {
    UrlPathValidator(req.params)
    var validatorResult = SessionValidator(req.session, req.url)

    console.dir(validatorResult)

    if (!validatorResult[0]) {
      return res.redirect(validatorResult[1])
    }

    try {
      var hasChild = new HasChild(req.body['has-child'])
      if (hasChild.hasChild === 'yes') {
        return res.redirect(`/apply/eligibility/claim/about-child`)
      } else {
        return res.redirect(`/apply/eligibility/claim/expenses`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/eligibility/claim/has-child', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId
        })
      } else {
        throw error
      }
    }
  })
}
