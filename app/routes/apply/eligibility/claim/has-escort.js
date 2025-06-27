const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const HasEscort = require('../../../../services/domain/has-escort')
const ValidationError = require('../../../../services/errors/validation-error')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = function (router) {
  router.get('/apply/eligibility/claim/has-escort', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    getIsAdvanceClaim(req.session.claimId)
      .then(function (isAdvanceClaim) {
        return res.render('apply/eligibility/claim/has-escort', {
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          isAdvanceClaim
        })
      })
  })

  router.post('/apply/eligibility/claim/has-escort', function (req, res) {
    UrlPathValidator(req.params)
    const isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    try {
      const hasEscort = new HasEscort((req.body && req.body['has-escort']) ?? '')
      if (hasEscort.hasEscort === 'yes') {
        return res.redirect('/apply/eligibility/claim/about-escort')
      } else {
        return res.redirect('/apply/eligibility/claim/has-child')
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        getIsAdvanceClaim(req.session.claimId)
          .then(function (isAdvanceClaim) {
            return res.status(400).render('apply/eligibility/claim/has-escort', {
              errors: error.validationErrors,
              claimType: req.session.claimType,
              referenceId: req.session.referenceId,
              claimId: req.session.claimId,
              isAdvanceClaim
            })
          })
      } else {
        throw error
      }
    }
  })
}
