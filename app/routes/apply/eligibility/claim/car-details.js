const UrlPathValidator = require('../../../../services/validators/url-path-validator')
const referenceIdHelper = require('../../../helpers/reference-id-helper')
const ValidationError = require('../../../../services/errors/validation-error')
const expenseUrlRouter = require('../../../../services/routing/expenses-url-router')
const CarExpense = require('../../../../services/domain/expenses/car-expense')
const getTravellingFromAndTo = require('../../../../services/data/get-travelling-from-and-to')
const getMaskedEligibility = require('../../../../services/data/get-masked-eligibility')
const insertCarExpenses = require('../../../../services/data/insert-car-expenses')
const claimTypeEnum = require('../../../../constants/claim-type-enum')
const displayHelper = require('../../../../views/helpers/display-helper')
const getIsAdvanceClaim = require('../../../../services/data/get-is-advance-claim')
const SessionHandler = require('../../../../services/validators/session-handler')

module.exports = router => {
  router.get('/apply/eligibility/claim/car', (req, res, next) => {
    return get(false, req, res, next)
  })

  router.get('/apply/eligibility/claim/car-only', (req, res, next) => {
    return get(true, req, res, next)
  })

  router.post('/apply/eligibility/claim/car', (req, res, next) => {
    return post(false, req, res, next)
  })

  router.post('/apply/eligibility/claim/car-only', (req, res, next) => {
    return post(true, req, res, next)
  })
}

function get(carOnly, req, res, next) {
  UrlPathValidator(req.params)
  const isValidSession = SessionHandler.validateSession(req.session, req.url)

  if (!isValidSession) {
    return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
  }

  const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

  getIsAdvanceClaim(req.session.claimId).then(isAdvanceClaim => {
    if (
      req.session.claimType === claimTypeEnum.FIRST_TIME ||
      req.session.claimType === claimTypeEnum.REPEAT_NEW_ELIGIBILITY
    ) {
      getTravellingFromAndTo(referenceAndEligibilityId.reference, referenceAndEligibilityId.id)
        .then(result => {
          return res.render('apply/eligibility/claim/car-details', {
            claimType: req.session.claimType,
            referenceId: req.session.referenceId,
            claimId: req.session.claimId,
            params: expenseUrlRouter.parseParams(req.query),
            redirectUrl: expenseUrlRouter.getRedirectUrl(req),
            expense: result,
            carOnly,
            displayHelper,
            isAdvanceClaim,
          })
        })
        .catch(error => {
          next(error)
        })
    } else {
      getMaskedEligibility(referenceAndEligibilityId.reference, null, referenceAndEligibilityId.id)
        .then(result => {
          const fromAndTo = { from: result.Town, to: result.NameOfPrison }
          return res.render('apply/eligibility/claim/car-details', {
            claimType: req.session.claimType,
            referenceId: req.session.referenceId,
            claimId: req.session.claimId,
            params: expenseUrlRouter.parseParams(req.query),
            redirectUrl: expenseUrlRouter.getRedirectUrl(req),
            expense: fromAndTo,
            carOnly,
            displayHelper,
            isAdvanceClaim,
          })
        })
        .catch(error => {
          next(error)
        })
    }
  })

  return null
}

function post(carOnly, req, res, next) {
  UrlPathValidator(req.params)
  const isValidSession = SessionHandler.validateSession(req.session, req.url)

  if (!isValidSession) {
    return res.redirect(SessionHandler.getErrorPath(req.session, req.url))
  }

  const referenceAndEligibilityId = referenceIdHelper.extractReferenceId(req.session.referenceId)

  try {
    const expense = new CarExpense(
      req.body?.from,
      req.body?.to,
      req.body?.toll,
      req.body?.['toll-cost'] ?? '',
      req.body?.['parking-charge'] ?? '',
      req.body?.['parking-charge-cost'] ?? '',
      req.body?.['new-destination'] ?? '',
      req.body?.destination,
      req.body?.PostCode,
      req.body?.['new-origin'] ?? '',
      req.body?.origin,
      req.body?.FromPostCode,
    )

    insertCarExpenses(referenceAndEligibilityId.reference, referenceAndEligibilityId.id, req.session.claimId, expense)
      .then(() => {
        return res.redirect(expenseUrlRouter.getRedirectUrl(req))
      })
      .catch(error => {
        next(error)
      })
  } catch (error) {
    if (error instanceof ValidationError) {
      getIsAdvanceClaim(req.session.claimId).then(isAdvanceClaim => {
        return res.status(400).render('apply/eligibility/claim/car-details', {
          errors: error.validationErrors,
          claimType: req.session.claimType,
          referenceId: req.session.referenceId,
          claimId: req.session.claimId,
          params: expenseUrlRouter.parseParams(req.query),
          redirectUrl: expenseUrlRouter.getRedirectUrl(req),
          expense: req.body ?? {},
          carOnly,
          displayHelper,
          isAdvanceClaim,
        })
      })
    } else {
      throw error
    }
  }

  return null
}
