export enum PaymentMethodEnum {
  CASH = 'CASH',
  BANK = 'BANK',
  EWALLET = 'WALLET',
}

export enum PaymentEndPointEnum {
  CREATE_PAYMENT_INFOR = '/api/payment',
  GET_USER_PAYMENT_INFORS = '/api/payment',
  DELETE_USER_PAYMENT_INFOR = '/api/payment',
  EDIT_USER_PAYMENT_INFOR = '/api/payment',
  UPLOAD_PAYMENT_QR_CODE = '/api/payment/qrCode',
}
