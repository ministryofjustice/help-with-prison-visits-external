const AboutYou = require('../../../services/domain/about-you')
const ValidationError = require('../../../services/errors/validation-error')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const insertVisitor = require('../../../services/data/insert-visitor')
const duplicateClaimCheck = require('../../../services/data/duplicate-claim-check')
const getTravellingFromAndTo = require('../../../services/data/get-travelling-from-and-to')
const prisonsHelper = require('../../../constants/helpers/prisons-helper')
const enumHelper = require('../../../constants/helpers/enum-helper')
const relationshipHelper = require('../../../constants/prisoner-relationships-enum')
const dateFormatter = require('../../../services/date-formatter')
const benefitsHelper = require('../../../constants/benefits-enum')
const NORTHERN_IRELAND = 'Northern Ireland'

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

    var dob = dateFormatter.decodeDate(req.params.dob)
    var relationship = enumHelper.getKeyByAttribute(relationshipHelper, req.params.relationship, 'urlValue').value
    var benefit = enumHelper.getKeyByAttribute(benefitsHelper, req.params.benefit, 'urlValue').value
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

      duplicateClaimCheck(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, aboutYou.nationalInsuranceNumber)
      .then(function (isDuplicate) {
        if (isDuplicate) {
          return renderValidationError(req, res, visitorDetails, null, true)
        }

        return insertVisitor(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, aboutYou)
        .then(function () {
          return getTravellingFromAndTo(referenceAndEligibilityId.reference)
            .then(function (result) {
              var nameOfPrison = result.to
              var isNorthernIrelandClaim = aboutYou.country === NORTHERN_IRELAND
              var isNorthernIrelandPrison = prisonsHelper.isNorthernIrelandPrison(nameOfPrison)

              // Northern Ireland claims cannot be advance claims so skip future-or-past
              var nextPage = 'new-claim'
              if (isNorthernIrelandClaim && isNorthernIrelandPrison) {
                nextPage = 'new-claim/past'
              }

              return res.redirect(`/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/${nextPage}`)
            })
        })
      })
      .catch(function (error) {
        next(error)
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return renderValidationError(req, res, visitorDetails, error.validationErrors, false)
      } else {
        throw error
      }
    }
  })
}

function renderValidationError (req, res, visitorDetails, validationErrors, isDuplicateClaim) {
  return res.status(400).render('apply/new-eligibility/about-you', {
    errors: validationErrors,
    isDuplicateClaim: isDuplicateClaim,
    claimType: req.params.claimType,
    dob: req.params.dob,
    relationship: req.params.relationship,
    benefit: req.params.benefit,
    referenceId: req.params.referenceId,
    visitor: visitorDetails
  })
}
