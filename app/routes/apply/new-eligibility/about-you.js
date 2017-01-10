const AboutYou = require('../../../services/domain/about-you')
const ValidationError = require('../../../services/errors/validation-error')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const insertVisitor = require('../../../services/data/insert-visitor')
const getTravellingFromAndTo = require('../../../services/data/get-travelling-from-and-to')
const prisonsHelper = require('../../../constants/helpers/prisons-helper')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob/:relationship/:benefit/:referenceId', function (req, res) {
    UrlPathValidator(req.params)

    return res.render('apply/new-eligibility/about-you', {
      claimType: req.params.claimType,
      dob: req.params.dob,
      relationship: req.params.relationship,
      benefit: req.params.benefit,
      referenceId: req.params.referenceId
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob/:relationship/:benefit/:referenceId', function (req, res, next) {
    UrlPathValidator(req.params)

    var dob = req.params.dob
    var relationship = req.params.relationship
    var benefit = req.params.benefit
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.params.referenceId)
    var visitorDetails = req.body

    try {
      var aboutYou = new AboutYou(dob, relationship, benefit,
        req.body['FirstName'],
        req.body['LastName'],
        req.body['NationalInsuranceNumber'],
        req.body['HouseNumberAndStreet'],
        req.body['Town'],
        req.body['County'],
        req.body['PostCode'],
        req.body['Country'],
        req.body['EmailAddress'],
        req.body['PhoneNumber'])

      insertVisitor(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, aboutYou)
      .then(function () {
        return getTravellingFromAndTo(referenceAndEligibilityId.reference)
          .then(function (result) {
            var nameOfPrison = result.to
            var isNorthernIrelandClaim = prisonsHelper.isNorthernIrelandPrison(nameOfPrison)

            // Northern Ireland claims cannot be advance claims so skip future-or-past
            var nextPage = 'new-claim'
            if (isNorthernIrelandClaim) {
              nextPage = 'new-claim/past'
            }

            return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/${nextPage}`)
          })
      })
      .catch(function (error) {
        next(error)
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).render('apply/new-eligibility/about-you', {
          errors: error.validationErrors,
          claimType: req.params.claimType,
          dob: dob,
          relationship: relationship,
          benefit: benefit,
          referenceId: req.params.referenceId,
          visitor: visitorDetails
        })
      } else {
        throw error
      }
    }
  })
}
