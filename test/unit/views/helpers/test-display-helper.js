const expect = require('chai').expect

const displayHelper = require('../../../../app/views/helpers/display-helper')
const prisonsEnum = require('../../../../app/constants/prisons-enum')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const prisonerRelationshipsEnum = require('../../../../app/constants/prisoner-relationships-enum')
const expenseTypeEnum = require('../../../../app/constants/expense-type-enum')

describe('views/helpers/display-helper', function () {
  const VALID_PRISONER_RELATIONSHIP_VALUE = prisonerRelationshipsEnum.HUSBAND_WIFE_CIVIL.value
  const VALID_BENEFIT_VALUE = benefitsEnum.INCOME_SUPPORT.value
  const VALID_PRISON_VALUE = prisonsEnum.ALTCOURSE.value
  const VALID_EXPENSE_VALUE = expenseTypeEnum.BUS.value

  it('should return the correct prisoner relationship display name given a valid value', function () {
    var result = displayHelper.getPrisonerRelationshipDisplayName(VALID_PRISONER_RELATIONSHIP_VALUE)
    expect(result).to.equal(prisonerRelationshipsEnum.HUSBAND_WIFE_CIVIL.displayName)
  })

  it('should return the correct benefit display name given a valid value', function () {
    var result = displayHelper.getBenefitDisplayName(VALID_BENEFIT_VALUE)
    expect(result).to.equal(benefitsEnum.INCOME_SUPPORT.displayName)
  })

  it('should return the correct require benefit upload value given a valid input', function () {
    var result = displayHelper.getBenefitRequireUpload(VALID_BENEFIT_VALUE)
    expect(result).to.equal(benefitsEnum.INCOME_SUPPORT.requireBenefitUpload)
  })

  it('should return the correct benefit multipage value given a valid input', function () {
    var result = displayHelper.getBenefitMultipage(VALID_BENEFIT_VALUE)
    expect(result).to.equal(benefitsEnum.INCOME_SUPPORT.multipage)
  })

  it('should return the correct prison display name given a valid value', function () {
    var result = displayHelper.getPrisonDisplayName(VALID_PRISON_VALUE)
    expect(result).to.equal(prisonsEnum.ALTCOURSE.displayName)
  })

  it('should return the correct expense name given a valid value', function () {
    var result = displayHelper.getExpenseDisplayName(VALID_EXPENSE_VALUE)
    expect(result).to.equal(expenseTypeEnum.BUS.displayName)
  })

  it('should return the correct boolean for receipt required given a valid value', function () {
    var result = displayHelper.getExpenseReceiptRequired(VALID_EXPENSE_VALUE)
    expect(result).to.equal(expenseTypeEnum.BUS.receiptRequired)
  })
})
