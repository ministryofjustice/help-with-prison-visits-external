const claimDecisionEnum = require('../../constants/claim-decision-enum')

module.exports = function (status) {
  return claimDecisionEnum[status] ? claimDecisionEnum[status] : status
}
