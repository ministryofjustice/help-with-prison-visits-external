const claimEventEnum = require('../../constants/claim-event-enum')

module.exports = function (status) {
  return claimEventEnum[status] ? claimEventEnum[status] : status
}
