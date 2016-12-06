const UrlPathValidator = require('../../services/validators/url-path-validator')
const getViewClaim = require('../../services/data/get-view-claim')
const displayHelper = require('../../views/helpers/display-helper')
const dateHelper = require('../../views/helpers/date-helper')
const claimExpenseHelper = require('../../views/helpers/claim-expense-helper')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)
    getViewClaim(req.params.claimId, req.params.reference, req.params.dob)
      .then(function (claimDetails) {
        return res.render('your-claims/view-claim',
          {
            referenceId: req.params.referenceId,
            claimId: req.params.claimId,
            claimDetails: claimDetails,
            dateHelper: dateHelper,
            claimExpenseHelper: claimExpenseHelper,
            displayHelper: displayHelper
          })
      })
  })
}
