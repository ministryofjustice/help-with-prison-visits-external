const htmlSanitizerMiddleware = require('../../../app/middleware/htmlSanitizer')
const express = require('express')
const supertest = require('supertest')
const httpMocks = require('node-mocks-http')
const expect = require('chai').expect

describe('middleware/htmlSanitizer', function () {
  it('should sanitize string with <script> tag', function (done) {
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      body: {
        propertyToSanitize: '<script>hello</script> world'
      }
    })
    const mockResponse = httpMocks.createResponse()

    htmlSanitizerMiddleware()(mockRequest, mockResponse, function next (error) {
      if (error) { throw new Error('Expected not to receive an error') }

      expect(mockRequest.body.propertyToSanitize).to.equal(' world')
      done()
    })
  })

  it('should sanitize object with <script> tag', function (done) {
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      body: {
        propertyToSanitize: { someAttrib: '<script>hello</script> world' }
      }
    })
    const mockResponse = httpMocks.createResponse()

    htmlSanitizerMiddleware()(mockRequest, mockResponse, function next (error) {
      if (error) { throw new Error('Expected not to receive an error') }

      expect(mockRequest.body.propertyToSanitize).to.eql({ someAttrib: ' world' })
      done()
    })
  })

  it('should sanitize request body containing <script> tag', function (done) {
    const app = express()
    app.use(express.json())
    app.use(htmlSanitizerMiddleware())
    app.post('/', function (req, res, next) {
      res.send({ sanitized: req.body.propertyToSanitize })
    })
    const server = app.listen(3000)

    supertest(app)
      .post('/')
      .send({
        propertyToSanitize: '<script>hello</script> world'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err
        expect(res.body.sanitized).to.equal(' world')
        done()
      })

    server.close()
  })
})
