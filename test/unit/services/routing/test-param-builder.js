const expect = require('chai').expect
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
      var result = paramBuilder.format(null)
      expect(result).to.equal('')
    })

    it('should return empty string if passed undefined', function () {
      var result = paramBuilder.format(undefined)
      expect(result).to.equal('')
    })

    it('should return empty string if passed an empty array', function () {
      var result = paramBuilder.format([])
      expect(result).to.equal('')
    })

    it('should return valid query paramater string if passed a non empty array', function () {
      var result = paramBuilder.format(VALID_ARRAY)
      expect(result).to.equal(VALID_ARRAY_OUTPUT)
    })
  })

  describe('build', function () {
    it('should return an empty array if passed null', function () {
      var result = paramBuilder.build(null)
      expect(result).to.be.empty  //eslint-disable-line
    })

    it('should return an empty array if passed undefined', function () {
      var result = paramBuilder.build(undefined)
      expect(result).to.be.empty //eslint-disable-line
    })

    it('should return an empty array if passed an empty array', function () {
      var result = paramBuilder.build([])
      expect(result).to.be.empty //eslint-disable-line
    })

    it('should return an array of all valid paramaters if passed an array containing valid paramaters only', function () {
      var result = paramBuilder.build(VALID_ARRAY)
      expect(result).to.deep.equal([VALID_PARAM, VALID_PARAM])
    })

    it('should return an empty array if passed an array containing invalid paramaters only', function () {
      var result = paramBuilder.build(INVALID_ARRAY)
      expect(result).to.deep.equal([])
    })

    it('should return an array of all valid paramaters if passed an array containing valid and invalid paramaters', function () {
      var result = paramBuilder.build(VALID_AND_INVALID_ARRAY)
      expect(result).to.deep.equal([VALID_PARAM])
    })
  })

  describe('buildFormatted', function () {
    it('should return an empty array if passed null', function () {
      var result = paramBuilder.buildFormatted(null)
      expect(result).to.be.empty //eslint-disable-line
    })

    it('should return an empty array if passed undefined', function () {
      var result = paramBuilder.buildFormatted(undefined)
      expect(result).to.be.empty //eslint-disable-line
    })

    it('should return an empty array if passed an empty array', function () {
      var result = paramBuilder.buildFormatted([])
      expect(result).to.be.empty //eslint-disable-line
    })

    it('should return valid query paramater containing each valid paramater in the input array', function () {
      var result = paramBuilder.buildFormatted(VALID_ARRAY)
      expect(result).to.deep.equal(VALID_ARRAY_OUTPUT)
    })

    it('should return an empty string if passed an array containing only non valid parameters', function () {
      var result = paramBuilder.buildFormatted(INVALID_ARRAY)
      expect(result).to.deep.equal('')
    })

    it('should return valid query paramater containing only valid paramaters from the input array', function () {
      var result = paramBuilder.buildFormatted(VALID_AND_INVALID_ARRAY)
      expect(result).to.deep.equal(VALID_AND_INVALID_ARRAY_OUTPUT)
    })
  })
})
