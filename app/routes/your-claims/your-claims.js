const UrlPathValidator = require('../../services/validators/url-path-validator')
const getHistoricClaims = require('../../services/data/get-historic-claims')
const dateHelper = require('../../views/helpers/date-helper')
const claimStatusHelper = require('../../views/helpers/claim-status-helper')

const REFERENCE_DOB_ERROR = '?error=yes'

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference', function (req, res, next) {
    UrlPathValidator(req.params)
    getHistoricClaims(req.params.reference, req.params.dob)
      .then(function (claims) {
        if (claims.length === 0) {
          return res.redirect(`/start${REFERENCE_DOB_ERROR}`)
        }
        return res.render('your-claims/your-claims', {
          reference: req.params.reference,
          claims: claims,
          dateHelper: dateHelper,
          claimStatusHelper: claimStatusHelper
        })
      })
      .catch(function (error) {
        next(error)
      })
  })

  // TODO: Implement POST route. Should redirect to confirm-your-details page.
  // TODO: Implement POST route. Should redirect to page displaying details of the selected claim.
}
