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

const REFERENCE_DOB_ERROR = '?error=expired'

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/:dob/:relationship/:benefit/:referenceId', function (req, res) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded ||
        !req.session.relationship ||
        !req.session.benefit ||
        !req.session.referenceId) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    var claimType = req.session.claimType
    var dobEncoded = req.session.dobEncoded
    var relationship = req.session.relationship
    var benefit = req.session.benefit
    var referenceId = req.session.referenceId

    return res.render('apply/new-eligibility/about-you', {
      claimType: claimType,
      dob: dobEncoded,
      relationship: relationship,
      benefit: benefit,
      referenceId: referenceId
    })
  })

  router.post('/apply/:claimType/new-eligibility/:dob/:relationship/:benefit/:referenceId', function (req, res, next) {
    UrlPathValidator(req.params)

    if (!req.session ||
        !req.session.claimType ||
        !req.session.dobEncoded ||
        !req.session.relationship ||
        !req.session.benefit ||
        !req.session.referenceId) {
      return res.redirect(`/apply/first-time/new-eligibility${REFERENCE_DOB_ERROR}`)
    }

    var claimType = req.session.claimType
    var dobEncoded = req.session.dobEncoded
    var relationship = req.session.relationship
    var benefit = req.session.benefit
    var referenceId = req.session.referenceId

    var dobFormatted = dateFormatter.decodeDate(dobEncoded)
    var relationshipFormatted = enumHelper.getKeyByAttribute(relationshipHelper, relationship, 'urlValue').value
    var benefitFormatted = enumHelper.getKeyByAttribute(benefitsHelper, benefit, 'urlValue').value
    var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(referenceId)
    var visitorDetails = req.body

    try {
      var aboutYou = new AboutYou(dobFormatted, relationshipFormatted, benefitFormatted,
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

              return res.redirect(`/apply/${claimType}/eligibility/${referenceId}/${nextPage}`)
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
    claimType: req.session.claimType,
    dob: req.session.dobEncoded,
    relationship: req.session.relationship,
    benefit: req.session.benefit,
    referenceId: req.session.referenceId,
    visitor: visitorDetails
  })
}
