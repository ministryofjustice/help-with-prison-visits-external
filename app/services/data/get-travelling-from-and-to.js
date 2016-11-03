const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports.get = function (reference) {
  return knex('Visitor')
    .join('Prisoner', 'Visitor.Reference', '=', 'Prisoner.Reference')
    .where('Visitor.Reference', reference)
    .first('Visitor.Town', 'Prisoner.NameOfPrison')
    .then(function (result) {
      return {
        from: result.Town,
        to: result.NameOfPrison
      }
    })
}
