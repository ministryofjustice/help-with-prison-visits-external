const logSerializers = require('../../../app/services/log-serializers')

const REQUEST_URL = 'some url'
const REQUEST_METHOD = 'some method'
const REQUEST_PARAMS = 'some params'

const RESPONSE_STATUS_CODE = 'some status code'

const ERROR_MESSAGE = 'some message'
const ERROR_NAME = 'some name'
const ERROR_STACK = 'some stack'

const REQUEST = {
  url: REQUEST_URL,
  method: REQUEST_METHOD,
  params: REQUEST_PARAMS
}

const RESPONSE = {
  statusCode: RESPONSE_STATUS_CODE
}

const ERROR = {
  message: ERROR_MESSAGE,
  name: ERROR_NAME,
  stack: ERROR_STACK
}

describe('services/log-serializers', function () {
  it('should build the requestSerializer', function () {
    const result = logSerializers.requestSerializer(REQUEST)
    expect(result.url).toBe(REQUEST_URL)
    expect(result.method).toBe(REQUEST_METHOD)
    expect(result.params).toBe(REQUEST_PARAMS)
  })

  it('should build the responseSerializer', function () {
    const result = logSerializers.responseSerializer(RESPONSE)
    expect(result.statusCode).toBe(RESPONSE_STATUS_CODE)
  })

  it('should build the errorSerializer', function () {
    const result = logSerializers.errorSerializer(ERROR)
    expect(result.message).toBe(ERROR_MESSAGE)
    expect(result.name).toBe(ERROR_NAME)
    expect(result.stack).toBe(ERROR_STACK)
  })
})
