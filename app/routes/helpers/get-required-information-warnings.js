const InformationRequiredMessagesEnum = require('../../constants/information-required-messages')

module.exports = function (claimStatus, benefitStatus, benefitDocument, visitConfirmationStatus, visitConifirmationDocument, expenses, bankDetailsRequested) {
  var addInformation = []
  if (claimStatus === 'REQUEST-INFORMATION' || claimStatus === 'REQUEST-INFO-PAYMENT') {
    var caseworkerMessages = {field: 'messages', message: InformationRequiredMessagesEnum.CASEWORKER_MESSAGES}
    addInformation.push(caseworkerMessages)
  }

  if (!benefitDocument) {
    benefitDocument = {DocumentStatus: false}
  }
  if (requiredAttention(benefitStatus, benefitDocument)) {
    var benefit = {field: 'benefit-information', message: InformationRequiredMessagesEnum.BENEFIT}
    addInformation.push(benefit)
  }

  if (requiredAttention(visitConfirmationStatus, visitConifirmationDocument)) {
    var visitConfirmation = {field: 'VisitConfirmation', message: InformationRequiredMessagesEnum.VISIT_CONFIRMATION}
    addInformation.push(visitConfirmation)
  }

  for (var expense in expenses) {
    if (requiredAttention(expenses[expense].Status, {DocumentStatus: expenses[expense].DocumentStatus, fromInternalWeb: expenses[expense].fromInternalWeb})) {
      var expensesInformation = {field: 'claim-expense', message: InformationRequiredMessagesEnum.EXPENSE}
      addInformation.push(expensesInformation)
      break
    }
  }

  if (bankDetailsRequested) {
    var bankDetails = {field: 'bank-details', message: InformationRequiredMessagesEnum.BANK_DETAILS}
    addInformation.push(bankDetails)
  }
  return addInformation
}

function requiredAttention (status, document) {
  if (status === 'REQUEST-INFORMATION' && document.fromInternalWeb) {
    return true
  } else if (document.DocumentStatus === 'upload-later') {
    return true
  } else {
    return false
  }
}
