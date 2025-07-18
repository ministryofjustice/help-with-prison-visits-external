const fs = require('fs')
const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const documentTypeEnum = require('../../constants/document-type-enum')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const UploadError = require('../errors/upload-error')

class FileUpload {
  constructor(claimId, documentType, claimExpenseId, file, error, alternative) {
    this.file = file
    this.alternative = alternative
    this.error = error
    this.IsValid()
    if (!this.alternative) {
      this.path = file.path
    }
    this.claimId = claimId
    this.documentType = documentTypeEnum[documentType].documentType
    this.claimExpenseId = claimExpenseId
    if (this.claimExpenseId === undefined) {
      this.claimExpenseId = null
    }
    this.dateSubmitted = dateFormatter.now().toDate()

    if (file) {
      this.documentStatus = 'uploaded'
    } else {
      this.documentStatus = alternative
    }
  }

  IsValid() {
    const errors = ErrorHandler()

    if (this.error) {
      if (this.error instanceof UploadError) {
        throw new ValidationError({ upload: [ERROR_MESSAGES.getUploadIncorrectType] })
      } else {
        throw this.error
      }
    }

    if (!this.file) {
      FieldValidator(this.alternative, 'upload', errors).isRequired(ERROR_MESSAGES.getUploadRequired)
    }

    if (this.file && this.alternative) {
      fs.unlinkSync(this.file.path)
      throw new ValidationError({ upload: [ERROR_MESSAGES.getUploadFileAndAlternativeSelected] })
    }

    const validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = FileUpload
