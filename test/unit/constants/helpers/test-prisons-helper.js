const prisonsHelper = require('../../../../app/constants/helpers/prisons-helper')
const prisonsEnum = require('../../../../app/constants/prisons-enum')

describe('constants/helpers/prisons-helper', function () {
  const NI_PRISON = prisonsEnum.MAGHABERRY.value
  const NOT_NI_PRISON = prisonsEnum.HEWELL.value

  it('should true if value is a Northern Ireland prison', function () {
    expect(prisonsHelper.isNorthernIrelandPrison(NI_PRISON)).toBe(true)  //eslint-disable-line
  })

  it('should false if value is not a Northern Ireland prison', function () {
    expect(prisonsHelper.isNorthernIrelandPrison(NOT_NI_PRISON)).toBe(false)  //eslint-disable-line
  })
})
