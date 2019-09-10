const ChildEscort = require('../../../services/domain/child-escort')
const ValidationError = require('../../../services/errors/validation-error')
const UrlPathValidator = require('../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../helpers/reference-id-helper')
const insertVisitor = require('../../../services/data/insert-visitor')
const duplicateClaimCheck = require('../../../services/data/duplicate-claim-check')
const getTravellingFromAndTo = require('../../../services/data/get-travelling-from-and-to')
const prisonsHelper = require('../../../constants/helpers/prisons-helper')
const enumHelper = require('../../../constants/helpers/enum-helper')
const relationshipHelper = require('../../../constants/prisoner-relationships-child-escorts-enum')
const dateFormatter = require('../../../services/date-formatter')
const benefitsHelper = require('../../../constants/benefits-enum')
const NORTHERN_IRELAND = 'Northern Ireland'
const SessionHandler = require('../../../services/validators/session-handler')
const log = require('../../../services/log')

module.exports = function (router) {
  router.get('/apply/:claimType/new-eligibility/child-escort', function (req, res) {
    UrlPathValidator(req.params)
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    var relationshipsArray = []
    var prisonerRelationshipKeys = Object.keys(relationshipHelper)
    prisonerRelationshipKeys.forEach(function (realtionship) {
      relationshipsArray.push(relationshipHelper[realtionship])
    })
    console.log(req.url)
    var childEscort = {
      FirstName: 'Jamie',
      LastName: 'Bloggs',
      'dob-day': '22',
      'dob-month': '09',
      'dob-year': '2010',
      ParentFirstName: 'Joe',
      ParentLastName: 'Bloggs',
      HouseNumberAndStreet: '1 Main Street',
      Town: 'London',
      County: 'London',
      PostCode: 'SW195AE'
    }
    return res.render('apply/new-eligibility/child-escort', {
      URL: req.url,
      relationships: relationshipsArray,
      childEscort: childEscort
    })
  })

  router.post('/apply/:claimType/new-eligibility/child-escort', function (req, res, next) {
    UrlPathValidator(req.params)
    req.session.claimType = req.params.claimType
    var isValidSession = SessionHandler.validateSession(req.session, req.url)

    if (!isValidSession) {
      return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
    }

    // var dob = dateFormatter.decodeDate(req.session.dobEncoded)
    // var benefit = enumHelper.getKeyByAttribute(benefitsHelper, req.session.benefit, 'urlValue').value
    // var benefitOwner = req.session.benefitOwner
    // var referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)
    // var visitorDetails = req.body
    return res.redirect(`/apply/${req.params.claimType}/new-eligibility/benefits`)
    /* try {
      var childEscort = new ChildEscort(dob, relationship, benefit, benefitOwner,
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
              var nextPage = 'future-or-past-visit'
              if (isNorthernIrelandClaim && isNorthernIrelandPrison) {
                req.session.advanceOrPast = 'past'
                nextPage = 'journey-information'
              }

              return res.redirect(`/apply/eligibility/new-claim/${nextPage}`)
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
    } */
  })
}

function renderValidationError (req, res, visitorDetails, validationErrors, isDuplicateClaim) {
  return res.status(400).render('apply/new-eligibility/child-escort', {
    errors: validationErrors,
    isDuplicateClaim: isDuplicateClaim,
    claimType: req.session.claimType,
    dob: req.session.dobEncoded,
    relationship: req.session.relationship,
    benefit: req.session.benefit,
    benefitOwner: req.session.benefitOwner,
    referenceId: req.session.referenceId,
    visitor: visitorDetails
  })
}
