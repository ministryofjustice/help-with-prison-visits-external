const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference) {
  return knex('Visitor')
    .join('Prisoner', 'Visitor.Reference', '=', 'Prisoner.Reference')
    .where('Visitor.Reference', reference)
    .first('Visitor.HouseNumberAndStreet', 'Visitor.Town', 'Visitor.County', 'Visitor.PostCode', 'Prisoner.NameOfPrison')
    .then(function (result) {
      return {
        from: `${result.HouseNumberAndStreet}, ${result.Town}, ${result.County}, ${result.PostCode}`,
        to: result.NameOfPrison
      }
    })
}
