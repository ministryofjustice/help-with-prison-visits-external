const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const getIndividualClaimDetails = require('../../../../services/data/get-individual-claim-details')

module.exports = function (router) {
  router.get('/first-time-claim/eligibility/:reference/claim/:claimId/summary', function (req, res) {
    UrlPathValidator(req.params)

    getIndividualClaimDetails(req.params.claimId)
      .then(function (claimDetails) {
        return res.render('first-time/eligibility/claim/claim-summary',
          {
            reference: req.params.reference,
            claimId: req.params.claimId,
            claimDetails: claimDetails
          })
      })
  })

  router.post('/first-time-claim/eligibility/:reference/claim/:claimId/summary', function (req, res) {
    UrlPathValidator(req.params)
    return res.redirect(`/first-time-claim/eligibility/${req.params.reference}/claim/${req.params.claimId}/bank-account-details`)
  })
}
