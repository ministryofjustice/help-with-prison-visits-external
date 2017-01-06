module.exports = {
  CAR: {
    value: 'car',
    displayName: 'Car',
    receiptRequired: false
  },

  CAR_ONLY: {
    value: 'car-only',
    displayName: 'Car',
    receiptRequired: false
  },

  CAR_TOLL: {
    value: 'toll',
    displayName: 'Toll',
    receiptRequired: false
  },

  CAR_PARKING_CHARGE: {
    value: 'parking',
    displayName: 'Parking charge',
    receiptRequired: false
  },

  CAR_HIRE: {
    value: 'hire',
    displayName: 'Car hire',
    receiptRequired: true
  },

  BUS: {
    value: 'bus',
    displayName: 'Bus',
    receiptRequired: true
  },

  TRAIN: {
    value: 'train',
    displayName: 'Train',
    receiptRequired: true
  },

  TAXI: {
    value: 'taxi',
    displayName: 'Taxi',
    receiptRequired: true
  },

  PLANE: {
    value: 'plane',
    displayName: 'Plane',
    receiptRequired: true
  },

  FERRY: {
    value: 'ferry',
    displayName: 'Ferry',
    receiptRequired: true,
    ticketType: {
      'foot-passenger': 'a foot passenger',
      'car-passenger': 'a car passenger'
    }
  },

  LIGHT_REFRESHMENT: {
    value: 'refreshment',
    displayName: 'Light refreshment',
    receiptRequired: false
  },

  ACCOMMODATION: {
    value: 'accommodation',
    displayName: 'Accommodation',
    receiptRequired: true
  }
}
