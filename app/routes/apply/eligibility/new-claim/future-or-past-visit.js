const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const claimTypeEnum = require('../../../../constants/claim-type-enum')

module.exports = function (router) {
  router.get('/apply/:claimType/eligibility/:referenceId/new-claim', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/eligibility/new-claim/future-or-past-visit', {
      claimType: req.params.claimType,
      referenceId: req.params.referenceId
    })
  })

  router.post('/apply/:claimType/eligibility/:referenceId/new-claim', function (req, res) {
    UrlPathValidator(req.params)

    var advanceOrPast = req.body['advance-past']
    var nextPage = advanceOrPast
    if (req.params.claimType === claimTypeEnum.REPEAT_CLAIM) {
      nextPage = `same-journey-as-last-claim/${advanceOrPast}`
    }

    return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/new-claim/${nextPage}`)
  })
}
