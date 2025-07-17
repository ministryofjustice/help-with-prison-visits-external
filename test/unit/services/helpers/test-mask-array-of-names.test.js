const maskArrayOfNames = require('../../../../app/services/helpers/mask-array-of-names')

const LAST_NAME_1 = 'Bloggs'
const LAST_NAME_MASKED_1 = 'B*****'

const LAST_NAME_2 = 'Aloggs'
const LAST_NAME_MASKED_2 = 'A*****'

const NAMES = [{ LastName: LAST_NAME_1 }, { LastName: LAST_NAME_2 }]

describe('services/helpers/mask-array-of-names', () => {
  it('should return the masked array of input strings', () => {
    const maskedArray = maskArrayOfNames(NAMES)
    expect(maskedArray[0].LastName).toBe(LAST_NAME_MASKED_1)
    expect(maskedArray[1].LastName).toBe(LAST_NAME_MASKED_2)
  })
})
