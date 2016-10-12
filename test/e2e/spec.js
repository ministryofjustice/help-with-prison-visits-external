var assert = require('assert')

describe('First time claim flow', () => {
  it('should display the landing page for the service', () => {
    return browser.url('/')
      .getTitle().then(function (title) {
        assert.equal(title, 'Assisted Prison Visit Service')
      })
      // .click('#start')
  })
})
