/// <reference types="cypress" />

describe('GOV.UK redirect', () => {
  it('should redirect / to gov.uk site', () => {

    cy.request({
      url: '/',
      followRedirect: false,
    }).then((resp) => {
      expect(resp.status).to.eq(302)
      expect(resp.redirectedToUrl).to.eq('https://www.gov.uk/help-with-prison-visits')
    })
  })
})