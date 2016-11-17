module.exports = {
  INCOME_SUPPORT: {
    value: 'income-support',
    requireBenefitUpload: false,
    displayName: 'Income Support',
    multipage: false
  },

  JOBSEEKERS_ALLOWANCE: {
    value: 'jobseekers-allowance',
    requireBenefitUpload: false,
    displayName: 'Jobseeker’s Allowance',
    multipage: false
  },

  EMPLOYMENT_SUPPORT: {
    value: 'employment-support',
    requireBenefitUpload: false,
    displayName: 'Employment and Support Allowance',
    multipage: false
  },

  UNIVERSAL_CREDIT: {
    value: 'universal-credit',
    requireBenefitUpload: false,
    displayName: 'Universal Credit',
    multipage: false
  },

  WORKING_TAX_CREDIT: {
    value: 'working-tax-credit',
    requireBenefitUpload: true,
    displayName: 'Working Tax credits with disability or Child tax credit',
    multipage: true
  },

  PENSION_CREDIT: {
    value: 'pension-credit',
    requireBenefitUpload: true,
    displayName: 'Pension Credit',
    multipage: true
  },

  HC2: {
    value: 'hc2',
    requireBenefitUpload: true,
    displayName: 'Health Certificate (HC2)',
    multipage: false
  },

  HC3: {
    value: 'hc3',
    requireBenefitUpload: true,
    displayName: 'Health Certificate (HC3)',
    multipage: false
  },

  NHS_TAX_CREDIT: {
    value: 'nhs-tax-credit',
    requireBenefitUpload: true,
    displayName: 'NHS Tax Credit Exemption Certificate',
    multipage: false
  },

  getByValue: function (value) {
    var self = this
    var result = value
    Object.keys(self).forEach(function (key) {
      var selfValue = self[key].value
      if (selfValue === value) {
        result = self[key]
      }
    })
    return result
  }
}
