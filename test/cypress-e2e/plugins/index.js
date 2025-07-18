/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const internalEligibilityHelper = require('../../helpers/data/internal/internal-eligibility-helper')
const claimHelper = require('../../helpers/data/claim-helper')
const referenceGenerator = require('../../../app/services/reference-generator')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    /**
     * Finds first claim reference for given Assisted Digital
     * caseworker then deletes all records with that reference
     *
     * @param {String} caseworker email address
     */
    deleteRecordsforADCaseworker(caseworker) {
      return claimHelper.getRef(caseworker).then(reference => {
        return internalEligibilityHelper.deleteAll(reference)
      })
    },

    /**
     * Generates a claim reference and inserts necessary test
     * records for this across tables
     *
     * @param {String} status claim status (optional)
     * @returns String generated claim reference
     */
    insertEligibilityAndClaim(status) {
      const reference = referenceGenerator.generate()
      internalEligibilityHelper.insertEligibilityAndClaim(reference, status)
      return reference
    },

    /**
     * Deletes all records with the given reference across all schemas
     *
     * @param {String} claim reference
     */
    deleteAllforReference(reference) {
      return internalEligibilityHelper.deleteAll(reference)
    },
  })
}
