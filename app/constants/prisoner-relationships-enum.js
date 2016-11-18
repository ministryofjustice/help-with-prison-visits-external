const EnumHelper = require('./helpers/enum-helper')

module.exports = {
  HUSBAND_WIFE_CIVIL: {
    value: 'husband-wife-civil',
    displayName: 'Husband, wife or civil partner'
  },

  PARTNER: {
    value: 'partner',
    displayName: 'Partner'
  },

  PARENT_GRANDPARENT: {
    value: 'parent-grandparent',
    displayName: 'Parent or grand-parent'
  },

  SIBLING: {
    value: 'sibling',
    displayName: 'Brother or sister'
  },

  CHILD: {
    value: 'child',
    displayName: 'Son or daughter'
  },

  SOLE_VISITOR: {
    value: 'sole-visitor',
    displayName: 'Sole visitor'
  },

  NONE: {
    value: 'none',
    displayName: ''
  },

  getByValue: function (value) {
    return EnumHelper.getKeyByValue(this, value)
  }
}
