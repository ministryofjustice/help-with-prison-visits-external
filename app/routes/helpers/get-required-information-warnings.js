module.exports = function (claimStatus, benefitStatus, benefitDocument, visitConfirmationStatus, visitConifirmationDocument, expenses, bankDetailsRequested) {
  var addInformation = []
  if (claimStatus === 'REQUEST-INFORMATION' || claimStatus === 'REQUEST-INFO-PAYMENT') {
    var caseworkerMessages = {field: 'messages', message: 'View messages from caseworker'}
    addInformation.push(caseworkerMessages)
  }

  if (!benefitDocument) {
    benefitDocument = {DocumentStatus: false}
  }
  if (requiredAttention(benefitStatus, benefitDocument)) {
    var benefit = {field: 'benefit-information', message: 'Benefit information is needed'}
    addInformation.push(benefit)
  }

  if (requiredAttention(visitConfirmationStatus, visitConifirmationDocument)) {
    var visitConfirmation = {field: 'VisitConfirmation', message: 'Visit confirmation information is needed'}
    addInformation.push(visitConfirmation)
  }

  for (var expense in expenses) {
    if (requiredAttention(expenses[expense].Status, {DocumentStatus: expenses[expense].DocumentStatus, fromInternalWeb: expenses[expense].fromInternalWeb})) {
      var expensesInformation = {field: 'claim-expense', message: 'Expense information is needed'}
      addInformation.push(expensesInformation)
      break
    }
  }

  if (bankDetailsRequested) {
    var bankDetails = {field: 'bank-details', message: 'Bank details requested'}
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
