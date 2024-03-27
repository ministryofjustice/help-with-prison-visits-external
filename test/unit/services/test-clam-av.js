// const proxyquire = require('proxyquire')
// const sinon = require('sinon')
// var clamAv
// var isInfectedSub
// var clamStub
// var mockConfig

// describe('services/clam-av', function () {
//   beforeEach(function () {
//     mockConfig = jest.fn()
//     isInfectedSub = jest.fn().mockResolvedValue()
//     clamStub = jest.fn().mockResolvedValue({
//       is_infected: isInfectedSub,
//       init: jest.fn().mockResolvedValue()
//     })

//     clamAv = proxyquire('../../../app/services/clam-av', {
//       clam: clamStub,
//       '../../config': mockConfig
//     })
//   })

//   describe('scan for malware', function () {
//     it('should scan file when malware scanning is enabled', function () {
//       mockConfig.ENABLE_MALWARE_SCANNING = 'true'
//       console.log(mockConfig.ENABLE_MALWARE_SCANNING)
//       clamAv.scan('/tmp/dummy/path')
//       sinon.assert.calledOnce(isInfectedSub)
//     })

//     it('should not scan file when malware scanning is disabled', function () {
//       mockConfig.ENABLE_MALWARE_SCANNING = 'false'
//       console.log(mockConfig.ENABLE_MALWARE_SCANNING)
//       clamAv.scan('/tmp/dummy/path')
//       sinon.assert.notCalled(isInfectedSub)
//     })
//   })
// })
