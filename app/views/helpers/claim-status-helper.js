const claimDescionEnum = require('../../constants/claim-decision-enum')

module.exports = function (status) {
  return claimDescionEnum[status] ? claimDescionEnum[status] : status
}
