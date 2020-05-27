const informationRequiredMessagesEnum = require('../../constants/information-required-messages-enum')
const claimStatusEnum = require('../../constants/claim-status-enum')

module.exports = function (claimStatus, benefitStatus, benefitDocument, visitConfirmationStatus, visitConifirmationDocument, expenses, bankDetailsRequested) {
  var addInformation = []
  if (claimStatus === claimStatusEnum.REQUEST_INFORMATION || claimStatus === claimStatusEnum.REQUEST_INFO_PAYMENT) {
    var caseworkerMessages = { field: 'messages', message: informationRequiredMessagesEnum.CASEWORKER_MESSAGES }
    addInformation.push(caseworkerMessages)
  }

  if (!benefitDocument) {
    benefitDocument = { DocumentStatus: false }
  }

  if (requiredAttention(benefitStatus, benefitDocument)) {
    var benefit = { field: 'benefit-information', message: informationRequiredMessagesEnum.BENEFIT }
    addInformation.push(benefit)
  }

  if (requiredAttention(visitConfirmationStatus, visitConifirmationDocument)) {
    var visitConfirmation = { field: 'VisitConfirmation', message: informationRequiredMessagesEnum.VISIT_CONFIRMATION }
    addInformation.push(visitConfirmation)
  }

  for (var expense in expenses) {
    if (requiredAttention(expenses[expense].Status, { DocumentStatus: expenses[expense].DocumentStatus, fromInternalWeb: expenses[expense].fromInternalWeb })) {
      var expensesInformation = { field: 'claim-expense', message: informationRequiredMessagesEnum.EXPENSE }
      addInformation.push(expensesInformation)
      break
    }
  }

  if (bankDetailsRequested) {
    var bankDetails = { field: 'bank-details', message: informationRequiredMessagesEnum.BANK_DETAILS }
    addInformation.push(bankDetails)
  }
  return addInformation
}

function requiredAttention (status, document) {
  if (status === claimStatusEnum.REQUEST_INFORMATION && document.fromInternalWeb) {
    return true
  } else if (document && document.DocumentStatus === 'upload-later') {
    return true
  } else {
    return false
  }
}
