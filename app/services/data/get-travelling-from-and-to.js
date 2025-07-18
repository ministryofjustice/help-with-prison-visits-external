const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = reference => {
  const db = getDatabaseConnector()

  return db('Visitor')
    .join('Prisoner', 'Visitor.Reference', '=', 'Prisoner.Reference')
    .where('Visitor.Reference', reference)
    .first('Visitor.Town', 'Prisoner.NameOfPrison')
    .then(result => {
      return {
        from: result.Town,
        to: result.NameOfPrison,
      }
    })
}
