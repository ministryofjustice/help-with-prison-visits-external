const UrlPathValidator = require('../../services/validators/url-path-validator')
const getViewClaim = require('../../services/data/get-view-claim')
const displayHelper = require('../../views/helpers/display-helper')
const dateHelper = require('../../views/helpers/date-helper')
const claimExpenseHelper = require('../../views/helpers/claim-expense-helper')
const referenceIdHelper = require('../helpers/reference-id-helper')
const ViewClaim = require('../../services/domain/view-claim')
const ValidationError = require('../../services/errors/validation-error')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference/:claimId', function (req, res, next) {
    UrlPathValidator(req.params)
    getViewClaim(req.params.claimId, req.params.reference, req.params.dob)
      .then(function (claimDetails) {
        var referenceId = referenceIdHelper.getReferenceId(req.params.reference, claimDetails.claim.EligibilityId)
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
    getViewClaim(req.params.claimId, req.params.reference, req.params.dob)
      .then(function (claimDetails) {
        try {
          var benefit = claimDetails.claim.benefitDocument
          if (benefit.length <= 0) {
            benefit.push({fromInternalWeb: true})
          }
          var claim = new ViewClaim(claimDetails.claim.visitConfirmation.fromInternalWeb, benefit[0].fromInternalWeb, claimDetails.claimExpenses) // eslint-disable-line no-unused-vars
          // TODO task insertion
          res.redirect(`/application-updated/${req.params.reference}`)
        } catch (error) {
          if (error instanceof ValidationError) {
            var referenceId = referenceIdHelper.getReferenceId(req.params.reference, claimDetails.claim.EligibilityId)
            return res.status(400).render('your-claims/view-claim', {
              errors: error.validationErrors,
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
          } else {
            next(error)
          }
        }
      })
  })
}
