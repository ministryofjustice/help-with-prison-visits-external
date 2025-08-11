const claimEventEnum = require('../../constants/claim-event-enum')

module.exports = status => {
  return claimEventEnum[status] ? claimEventEnum[status] : status
}
