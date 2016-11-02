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
    platformName: 'iOS',
    platformVersion: '9.1',
    browserName: 'Safari',
    deviceName: 'iPhone 6s Simulator',
    deviceOrientation: 'portrait'
  }],
  sync: false,
  logLevel: 'verbose',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  waitforTimeout: 300000,
  connectionRetryTimeout: 300000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 800000
  }
}
