const EnumHelper = require('./helpers/enum-helper')

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
    displayName: 'Jobseeker’s Allowance (JSA)',
    multipage: false
  },

  EMPLOYMENT_SUPPORT: {
    value: 'employment-support',
    requireBenefitUpload: false,
    displayName: 'Employment and Support Allowance (ESA)',
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
    displayName: 'Working Tax credits (with disability or child tax) or Child Tax Credit',
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
    return EnumHelper.getKeyByValue(this, value)
  }
}
