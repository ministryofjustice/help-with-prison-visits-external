const UrlPathValidator = require('../../services/validators/url-path-validator')

module.exports = function (router) {
  router.get('/your-claims/:dob/:reference', function (req, res) {
    UrlPathValidator(req.params)

    // TODO: Need to redirect the user to the start page if the dob/reference combination returned no results.
    // TODO: Replace claims with real data pulled from the database.
    return res.render('your-claims/your-claims', {
      reference: req.params.reference,
      claims: [
        { DateOfClaim: '2016-11-11', Status: 'PENDING', Link: '#' },
        { DateOfClaim: '2016-10-28', Status: 'APPROVED', Link: '#' },
        { DateOfClaim: '2016-10-15', Status: 'APPROVED', Link: '#' }
      ]
    })
  })

  // TODO: Implement POST route. Should redirect to confirm-your-details page.
  // TODO: Implement POST route. Should redirect to page displaying details of the selected claim.
}
