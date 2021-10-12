const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.DATE_ADDED = dateFormatter.now()
module.exports.CASEWORKER = 'Tester'
module.exports.ADDITIONAL_DATA = 'Add'
module.exports.NOTE = 'Note'

module.exports.DATE_ADDED2 = dateFormatter.now()
module.exports.CASEWORKER2 = 'Internal'
module.exports.ADDITIONAL_DATA2 = 'Add2'
module.exports.NOTE2 = 'Note2'

module.exports.build = function (dateAdded, caseworker, additionalData, note, isInternal) {
  return {
    DateAdded: dateAdded.toDate(),
    Caseworker: caseworker,
    Event: 'Event',
    AdditionalData: additionalData,
    Note: note,
    IsInternal: isInternal
  }
}

module.exports.insert = function (reference, eligibilityId, claimId, data) {
  const claimEvent = data || this.build(this.DATE_ADDED, this.CASEWORKER, this.ADDITIONAL_DATA, this.NOTE, false)
  const claimEvent2 = data || this.build(this.DATE_ADDED2, this.CASEWORKER2, this.ADDITIONAL_DATA2, this.NOTE2, true)
  const db = getDatabaseConnector()

  return db('IntSchema.ClaimEvent').insert({
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    DateAdded: claimEvent.DateAdded,
    Caseworker: claimEvent.Caseworker,
    Event: claimEvent.Event,
    AdditionalData: claimEvent.AdditionalData,
    Note: claimEvent.Note,
    IsInternal: claimEvent.IsInternal
  })
    .then(function () {
      return db('IntSchema.ClaimEvent').insert({
        ClaimId: claimId,
        EligibilityId: eligibilityId,
        Reference: reference,
        DateAdded: claimEvent2.DateAdded,
        Caseworker: claimEvent2.Caseworker,
        Event: claimEvent2.Event,
        AdditionalData: claimEvent2.AdditionalData,
        Note: claimEvent2.Note,
        IsInternal: claimEvent2.IsInternal
      })
    })
}

module.exports.get = function (claimId) {
  const db = getDatabaseConnector()

  return db.first()
    .from('IntSchema.ClaimEvent')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  const db = getDatabaseConnector()

  return db('IntSchema.ClaimEvent')
    .where('ClaimId', claimId)
    .del()
}
