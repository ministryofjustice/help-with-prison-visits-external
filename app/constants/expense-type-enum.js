module.exports = {
  CAR: {
    value: 'car',
    displayName: 'Car',
    receiptRequired: true,
    receiptMandatory: false,
    ticketed: false
  },

  CAR_ONLY: {
    value: 'car-only',
    displayName: 'Car',
    receiptRequired: true,
    receiptMandatory: false,
    ticketed: false
  },

  CAR_TOLL: {
    value: 'toll',
    displayName: 'Toll',
    receiptRequired: false,
    receiptMandatory: false,
    ticketed: false
  },

  CAR_PARKING_CHARGE: {
    value: 'parking',
    displayName: 'Parking charge',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: false
  },

  CAR_HIRE: {
    value: 'hire',
    displayName: 'Car hire',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: false
  },

  BUS: {
    value: 'bus',
    displayName: 'Bus',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: true
  },

  TRAIN: {
    value: 'train',
    displayName: 'Train',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: true
  },

  TAXI: {
    value: 'taxi',
    displayName: 'Taxi',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: true
  },

  PLANE: {
    value: 'plane',
    displayName: 'Plane',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: true
  },

  FERRY: {
    value: 'ferry',
    displayName: 'Ferry',
    receiptRequired: true,
    receiptMandatory: true,
    ticketType: {
      'foot-passenger': 'a foot passenger',
      'car-passenger': 'a car passenger'
    },
    ticketed: true
  },

  LIGHT_REFRESHMENT: {
    value: 'refreshment',
    displayName: 'Light refreshment',
    receiptRequired: false,
    receiptMandatory: false,
    ticketed: false
  },

  ACCOMMODATION: {
    value: 'accommodation',
    displayName: 'Accommodation',
    receiptRequired: true,
    receiptMandatory: true,
    ticketed: false
  }
}
