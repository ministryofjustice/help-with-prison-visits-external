const UrlPathValidator = require('../../services/validators/url-path-validator')
const getClaimsWithReference = require('../../services/data/get-claims-with-reference')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference', function (req, res) {
    UrlPathValidator(req.params)
    getClaimsWithReference(req.params.reference)
      .then (function(claims) {
        console.log(claims) // TODO: TEMP
        return res.render('your-claims/your-claims', {
          reference: req.params.reference,
          claims: claims
        })
      })
    // TODO: Need to redirect the user to the start page if the dob/reference combination returned no results.
  })

  // TODO: Implement POST route. Should redirect to confirm-your-details page.
  // TODO: Implement POST route. Should redirect to page displaying details of the selected claim.
}
