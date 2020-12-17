// const proxyquire = require('proxyquire')
// const sinon = require('sinon')
// var clamAv
// var isInfectedSub
// var clamStub
// var configStub

// describe('services/clam-av', function () {
//   beforeEach(function () {
//     configStub = sinon.stub()
//     isInfectedSub = sinon.stub().resolves()
//     clamStub = sinon.stub().resolves({
//       is_infected: isInfectedSub,
//       init: sinon.stub().resolves()
//     })

//     clamAv = proxyquire('../../../app/services/clam-av', {
//       clam: clamStub,
//       '../../config': configStub
//     })
//   })

//   describe('scan for malware', function () {
//     it('should scan file when malware scanning is enabled', function () {
//       configStub.ENABLE_MALWARE_SCANNING = 'true'
//       console.log(configStub.ENABLE_MALWARE_SCANNING)
//       clamAv.scan('/tmp/dummy/path')
//       sinon.assert.calledOnce(isInfectedSub)
//     })

//     it('should not scan file when malware scanning is disabled', function () {
//       configStub.ENABLE_MALWARE_SCANNING = 'false'
//       console.log(configStub.ENABLE_MALWARE_SCANNING)
//       clamAv.scan('/tmp/dummy/path')
//       sinon.assert.notCalled(isInfectedSub)
//     })
//   })
// })
