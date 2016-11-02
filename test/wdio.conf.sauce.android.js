exports.config = {
  specs: ['./test/e2e/**/*.js'],
  exclude: [],
  maxInstances: 1,
  services: ['sauce'],
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  baseUrl: process.env.SAUCE_BASEURL || 'http://localhost:3000',
  sauceConnect: true,
  capabilities: [{
    maxInstances: 1,
    platformName: 'Android',
    platformVersion: '5.1',
    browserName: 'Browser',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait'
  }],
  sync: false,
  logLevel: 'verbose',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  waitforTimeout: 180000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 500000
  }
}
