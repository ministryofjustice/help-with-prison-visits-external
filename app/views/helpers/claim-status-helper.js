const claimDecisionEnum = require('../../constants/claim-decision-enum')

module.exports = status => {
  return claimDecisionEnum[status] ? claimDecisionEnum[status] : status
}
