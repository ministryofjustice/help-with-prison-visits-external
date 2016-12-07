const UrlPathValidator = require('../../services/validators/url-path-validator')
const getViewClaim = require('../../services/data/get-view-claim')
const displayHelper = require('../../views/helpers/display-helper')
const dateHelper = require('../../views/helpers/date-helper')
const claimExpenseHelper = require('../../views/helpers/claim-expense-helper')
const referenceIdHelper = require('../helpers/reference-id-helper')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)
    getViewClaim(req.params.claimId, req.params.reference, req.params.dob)
      .then(function (claimDetails) {
        var referenceId = referenceIdHelper.getReferenceId(req.params.reference, claimDetails.claim.EligibilityId)
        console.log(claimDetails)
        return res.render('your-claims/view-claim',
          {
            reference: req.params.reference,
            referenceId: referenceId,
            dob: req.params.dob,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper,
            claimType: 'updating'
          })
      })
  })

  router.post('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)
    // TODO domain check
    // TODO task insertion
    // TODO redirect to claim updated page
  })
}
