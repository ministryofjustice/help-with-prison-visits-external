const expect = require('chai').expect
const forEdit = require('../../../../app/routes/helpers/for-edit')

const VALID_STATUS = 'PENDING'
const INVALID_STATUS = 'APPROVED'

describe('routes/helpers/for-edit', function () {
  it('should return true for valid status', function () {
    expect(forEdit(VALID_STATUS)).to.be.true
  })

  it('should return false for invalid status', function () {
    expect(forEdit(INVALID_STATUS)).to.be.false
  })
})
