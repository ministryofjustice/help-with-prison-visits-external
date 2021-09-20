const validator = require('./common-validator')
const VALIDATION_ERROR = new Error('An error has occured')
const decrypt = require('../../services/helpers/decrypt')
const dateFormatter = require('../../services/date-formatter')
const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = {
  validateSession: function (session, url) {
    function validateParam (param, validateFunction) {
      if (param) {
        if (!validator[validateFunction](param)) {
          throw VALIDATION_ERROR
        }
      }
    }

    function validateData (session) {
      if (session.dobEncoded && session.dobEncoded != null) {
        const dob = dateFormatter.decodeDate(session.dobEncoded)

        validateParam(dob, 'isValidDateOfBirth')
      }

      if (session.relationship && session.relationship != null) {
        const relationship = session.relationship

        validateParam(relationship, 'isValidPrisonerRelationship')
      }

      if (session.benefit && session.benefit != null) {
        const benefit = session.benefit

        validateParam(benefit, 'isValidBenefit')
      }

      if (session.referenceId && session.referenceId != null) {
        const referenceId = decrypt(session.referenceId)

        validateParam(referenceId.reference, 'isValidReference')
        validateParam(referenceId.id, 'isValidReferenceId')
      }

      if (session.decryptedRef && session.decryptedRef != null) {
        const reference = session.decryptedRef

        validateParam(reference, 'isValidReference')
      }

      if (session.claimType && session.claimType != null) {
        const claimType = session.claimType

        validateParam(claimType, 'isValidClaimType')
      }

      if (session.advanceOrPast && session.advanceOrPast != null) {
        const advanceOrPast = session.advanceOrPast

        validateParam(advanceOrPast, 'isValidAdvanceOrPast')
      }

      if (session.claimId && session.claimId != null) {
        validateParam(session.claimId.toString(), 'isNumeric')
      }

      if (session.claimDocumentId && session.claimDocumentId != null) {
        validateParam(session.claimDocumentId.toString(), 'isNumeric')
      }
    }

    function checkDependencies (session, url) {
      const splitUrl = url.split('/')
      let page = splitUrl.pop(-1)

      if (page.includes('?')) {
        const tempPage = page.split('?')
        page = tempPage[0]
      }

      if (page === 'prisoner-relationship') {
        if (!session.dobEncoded) {
          return false
        } else {
          return true
        }
      }

      if (page === 'child-escort') {
        if (!session.dobEncoded ||
            !session.relationship) {
          return false
        } else {
          return true
        }
      }

      if (page === 'benefits') {
        if (!session.dobEncoded ||
            !session.relationship) {
          return false
        } else {
          return true
        }
      }

      if (page === 'about-the-prisoner') {
        if (!session.dobEncoded ||
            !session.relationship ||
            !session.benefit ||
            !session.benefitOwner) {
          return false
        } else {
          return true
        }
      }

      if (page === 'eligible-child') {
        if (!session.dobEncoded ||
            !session.relationship ||
            !session.benefit ||
            !session.referenceId ||
            !session.decryptedRef ||
            !session.benefitOwner) {
          return false
        } else {
          return true
        }
      }

      if (page === 'benefit-owner') {
        if (!session.dobEncoded ||
            !session.relationship ||
            !session.benefit ||
            !session.referenceId ||
            !session.decryptedRef ||
            !session.benefitOwner) {
          return false
        } else {
          return true
        }
      }

      if (page === 'about-you') {
        if (!session.dobEncoded ||
            !session.relationship ||
            !session.benefit ||
            !session.referenceId ||
            !session.decryptedRef ||
            !session.benefitOwner) {
          return false
        } else {
          return true
        }
      }

      if (page === 'future-or-past-visit') {
        if (!session.referenceId ||
            !session.decryptedRef ||
            !session.claimType) {
          return false
        } else {
          return true
        }
      }

      if (page === 'journey-information') {
        if (!session.referenceId ||
            !session.decryptedRef ||
            !session.claimType ||
            !session.advanceOrPast) {
          return false
        } else {
          return true
        }
      }

      if (page === 'has-escort' ||
          page === 'about-escort' ||
          page === 'has-child' ||
          page === 'about-child' ||
          page === 'expenses' ||
          page === 'accommodation' ||
          page === 'bus' ||
          page === 'car' ||
          page === 'car-only' ||
          page === 'hire' ||
          page === 'ferry' ||
          page === 'refreshment' ||
          page === 'child-care' ||
          page === 'plane' ||
          page === 'taxi' ||
          page === 'train' ||
          page === 'summary' ||
          page === 'payment-details' ||
          page === 'bank-payment-details' ||
          page === 'payout-confirmation' ||
          page === 'declaration') {
        if (!session.referenceId ||
            !session.decryptedRef ||
            !session.claimType ||
            !session.advanceOrPast ||
            !session.claimId) {
          return false
        } else {
          return true
        }
      }

      if (page === 'file-upload') {
        if (!session.decryptedRef ||
            !session.claimId) {
          return false
        } else {
          return true
        }
      }

      if (page === 'view-claim' ||
                 page === 'your-claims' ||
                 page === 'update-contact-details' ||
                 page === 'check-your-information') {
        if (!session.dobEncoded ||
            !session.decryptedRef) {
          return false
        } else {
          return true
        }
      }

      if (page === 'same-journey-as-last-claim') {
        if (!session.claimType ||
            !session.referenceId ||
            !session.decryptedRef ||
            !session.advanceOrPast) {
          return false
        } else {
          return true
        }
      }
    }

    validateData(session)
    return checkDependencies(session, url)
  },
  getErrorPath: function (session, url, referenceDisabled = false) {
    const splitUrl = url.split('/')
    let claimType = splitUrl[2]

    if (claimType !== claimTypeEnum.FIRST_TIME ||
        claimType !== claimTypeEnum.REPEAT_CLAIM ||
        claimType !== claimTypeEnum.REPEAT_DUPLICATE ||
        claimType !== claimTypeEnum.REPEAT_NEW_ELIGIBILITY) {
      if (session.claimType && session.claimType != null) {
        claimType = session.claimType
      }
    }

    let path = '/start-already-registered?error=expired'
    if (claimType === claimTypeEnum.FIRST_TIME) {
      path = `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth?error=expired`
    }
    if (referenceDisabled === true) {
      path = '/start-already-registered?error=disabled'
    }

    return path
  },
  clearSession: function (session, url) {
    const splitUrl = url.split('/')
    let page = splitUrl.pop(-1)

    if (page.includes('?')) {
      const tempPage = page.split('?')
      page = tempPage[0]
    }

    if (page === 'start' ||
        page === 'start-already-registered' ||
        page === 'date-of-birth' ||
        page === 'application-submitted') {
      session = null
    }

    return session
  }
}
