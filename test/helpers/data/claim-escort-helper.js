const { getDatabaseConnector } = require('../../../app/databaseConnector')
const AboutEscort = require('../../../app/services/domain/about-escort')
const insertEscort = require('../../../app/services/data/insert-escort')
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'SMITH'
module.exports.DAY = '15'
module.exports.MONTH = '05'
module.exports.YEAR = '1984'
module.exports.DOB = dateFormatter.build(this.DAY, this.MONTH, this.YEAR)

module.exports.build = () => {
  return new AboutEscort(this.FIRST_NAME, this.LAST_NAME, this.DAY, this.MONTH, this.YEAR)
}

module.exports.insert = (reference, eligibilityId, claimId) => {
  return insertEscort(reference, eligibilityId, claimId, this.build())
}

module.exports.get = claimId => {
  const db = getDatabaseConnector()

  return db.first().from('ExtSchema.ClaimEscort').where({ ClaimId: claimId, IsEnabled: true })
}

module.exports.delete = claimId => {
  const db = getDatabaseConnector()

  return db('ExtSchema.ClaimEscort').where('ClaimId', claimId).del()
}
