const EnumHelper = require('./helpers/enum-helper')

module.exports = {
  INCOME_SUPPORT: {
    value: 'income-support',
    requireBenefitUpload: false,
    displayName: 'Income Support',
    multipage: true,
    urlValue: 'b1'
  },

  JOBSEEKERS_ALLOWANCE: {
    value: 'jobseekers-allowance',
    requireBenefitUpload: false,
    displayName: 'Jobseeker’s Allowance (JSA)',
    multipage: true,
    urlValue: 'b2'
  },

  EMPLOYMENT_SUPPORT: {
    value: 'employment-support',
    requireBenefitUpload: false,
    displayName: 'Employment and Support Allowance (ESA)',
    multipage: true,
    urlValue: 'b3'
  },

  UNIVERSAL_CREDIT: {
    value: 'universal-credit',
    requireBenefitUpload: true,
    displayName: 'Universal Credit',
    multipage: true,
    urlValue: 'b4'
  },

  WORKING_TAX_CREDIT: {
    value: 'working-tax-credit',
    requireBenefitUpload: true,
    displayName: 'Working Tax credits (with disability or child tax) or Child Tax Credit',
    multipage: true,
    urlValue: 'b5'
  },

  PENSION_CREDIT: {
    value: 'pension-credit',
    requireBenefitUpload: true,
    displayName: 'Pension Credit',
    multipage: true,
    urlValue: 'b6'
  },

  HC2: {
    value: 'hc2',
    requireBenefitUpload: true,
    displayName: 'Health Certificate (HC2)',
    multipage: true,
    urlValue: 'b7'
  },

  HC3: {
    value: 'hc3',
    requireBenefitUpload: true,
    displayName: 'Health Certificate (HC3)',
    multipage: true,
    urlValue: 'b8'
  },

  NHS_TAX_CREDIT: {
    value: 'nhs-tax-credit',
    requireBenefitUpload: true,
    displayName: 'NHS Tax Credit Exemption Certificate',
    multipage: true,
    urlValue: 'b9'
  },

  NONE: {
    value: 'none',
    requireBenefitUpload: false,
    displayName: 'None',
    multipage: false,
    urlValue: 'none'
  },

  YES: {
    value: 'yes',
    requireBenefitUpload: false,
    displayName: 'Yes',
    multipage: false,
    urlValue: 'yes'
  },

  NO: {
    value: 'no',
    requireBenefitUpload: false,
    displayName: 'No',
    multipage: false,
    urlValue: 'no'
  },

  getByValue: function (value) {
    return EnumHelper.getKeyByAttribute(this, value)
  }
}
