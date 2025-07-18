let clamAv
const mockIsInfected = jest.fn()
const mockClam = jest.fn()
const mockConfig = jest.fn()

describe.skip('services/clam-av', () => {
  beforeEach(() => {
    mockIsInfected.mockResolvedValue()
    mockClam.mockResolvedValue({
      is_infected: mockIsInfected,
      init: jest.fn().mockResolvedValue(),
    })

    jest.mock('../../../config', () => mockConfig)
    jest.mock('clamscan', () => mockClam)

    clamAv = require('../../../app/services/clam-av')
  })

  describe('scan for malware', () => {
    it('should scan file when malware scanning is enabled', () => {
      mockConfig.ENABLE_MALWARE_SCANNING = 'true'
      clamAv.scan('/tmp/dummy/path')
      expect(mockIsInfected).hasBeenCalledTimes(1)
    })

    it('should not scan file when malware scanning is disabled', () => {
      mockConfig.ENABLE_MALWARE_SCANNING = 'false'
      clamAv.scan('/tmp/dummy/path')
      expect(mockIsInfected).not.toHaveBeenCalled()
    })
  })
})
