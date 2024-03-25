const moment = require('moment')
const forEdit = require('../../../../app/routes/helpers/for-edit')

const VALID_STATUS = 'PENDING'
const STATUS2 = 'APPROVED'
const pastDate = moment().subtract('1', 'day')
const futureDate = moment().add('1', 'day')
const ISADVANCE = true
const UPDATED = true
const INVALID_STATUS = 'REJECTED'

describe('routes/helpers/for-edit', function () {
  it('should return true for valid status non advance claim', function () {
    expect(forEdit(VALID_STATUS, false)).toBe(true)  //eslint-disable-line
  })

  it('should return true for approved status when advance claim is true and after date of journey', function () {
    expect(forEdit(STATUS2, ISADVANCE, pastDate)).toBe(true)  //eslint-disable-line
  })

  it('should return false when passed the updated argument of true', function () {
    expect(forEdit(STATUS2, ISADVANCE, pastDate, UPDATED)).toBe(false)  //eslint-disable-line
  })

  it('should return false for approved status when advance claim is true and before date of journey', function () {
    expect(forEdit(STATUS2, ISADVANCE, futureDate)).toBe(false)  //eslint-disable-line
  })

  it('should return false for approved status when advance claim is false', function () {
    expect(forEdit(STATUS2, false)).toBe(false)  //eslint-disable-line
  })

  it('should return false for invalid status', function () {
    expect(forEdit(INVALID_STATUS, false)).toBe(false)  //eslint-disable-line
  })
})
