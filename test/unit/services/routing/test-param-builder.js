const paramBuilder = require('../../../../app/services/routing/param-builder')

describe('services/routing/param-builder', function () {
  const VALID_PARAM = 'bus'
  const INVALID_PARAM = 'some invalid'

  const VALID_ARRAY = [VALID_PARAM, VALID_PARAM]
  const VALID_ARRAY_OUTPUT = `?${VALID_PARAM}=&${VALID_PARAM}=`

  const INVALID_ARRAY = [INVALID_PARAM, INVALID_PARAM]

  const VALID_AND_INVALID_ARRAY = [VALID_PARAM, INVALID_PARAM]
  const VALID_AND_INVALID_ARRAY_OUTPUT = `?${VALID_PARAM}=`

  describe('format', function () {
    it('should return empty string if passed null', function () {
      const result = paramBuilder.format(null)
      expect(result).toBe('')
    })

    it('should return empty string if passed undefined', function () {
      const result = paramBuilder.format(undefined)
      expect(result).toBe('')
    })

    it('should return empty string if passed an empty array', function () {
      const result = paramBuilder.format([])
      expect(result).toBe('')
    })

    it('should return valid query paramater string if passed a non empty array', function () {
      const result = paramBuilder.format(VALID_ARRAY)
      expect(result).toBe(VALID_ARRAY_OUTPUT)
    })
  })

  describe('build', function () {
    it('should return an empty array if passed null', function () {
      const result = paramBuilder.build(null)
      expect(Object.keys(result)).toHaveLength(0)  //eslint-disable-line
    })

    it('should return an empty array if passed undefined', function () {
      const result = paramBuilder.build(undefined)
      expect(Object.keys(result)).toHaveLength(0) //eslint-disable-line
    })

    it('should return an empty array if passed an empty array', function () {
      const result = paramBuilder.build([])
      expect(Object.keys(result)).toHaveLength(0) //eslint-disable-line
    })

    it('should return an array of all valid paramaters if passed an array containing valid paramaters only', function () {
      const result = paramBuilder.build(VALID_ARRAY)
      expect(result).toEqual([VALID_PARAM, VALID_PARAM])
    })

    it('should return an empty array if passed an array containing invalid paramaters only', function () {
      const result = paramBuilder.build(INVALID_ARRAY)
      expect(result).toEqual([])
    })

    it('should return an array of all valid paramaters if passed an array containing valid and invalid paramaters', function () {
      const result = paramBuilder.build(VALID_AND_INVALID_ARRAY)
      expect(result).toEqual([VALID_PARAM])
    })
  })

  describe('buildFormatted', function () {
    it('should return an empty array if passed null', function () {
      const result = paramBuilder.buildFormatted(null)
      expect(Object.keys(result)).toHaveLength(0) //eslint-disable-line
    })

    it('should return an empty array if passed undefined', function () {
      const result = paramBuilder.buildFormatted(undefined)
      expect(Object.keys(result)).toHaveLength(0) //eslint-disable-line
    })

    it('should return an empty array if passed an empty array', function () {
      const result = paramBuilder.buildFormatted([])
      expect(Object.keys(result)).toHaveLength(0) //eslint-disable-line
    })

    it('should return valid query paramater containing each valid paramater in the input array', function () {
      const result = paramBuilder.buildFormatted(VALID_ARRAY)
      expect(result).toEqual(VALID_ARRAY_OUTPUT)
    })

    it('should return an empty string if passed an array containing only non valid parameters', function () {
      const result = paramBuilder.buildFormatted(INVALID_ARRAY)
      expect(result).toEqual('')
    })

    it('should return valid query paramater containing only valid paramaters from the input array', function () {
      const result = paramBuilder.buildFormatted(VALID_AND_INVALID_ARRAY)
      expect(result).toEqual(VALID_AND_INVALID_ARRAY_OUTPUT)
    })
  })
})
