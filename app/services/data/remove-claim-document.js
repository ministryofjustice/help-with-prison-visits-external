const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const fs = require('fs')

module.exports = function (claimDocumentId) {
  return knex('ClaimDocument')
    .returning('Filepath')
    .where('ClaimDocumentId', claimDocumentId)
    .update({
      IsEnabled: false
    })
    .then(function (filepath) {
      if (filepath[0] && fs.existsSync(filepath[0])) {
        fs.unlinkSync(filepath[0])
      }
    })
}
