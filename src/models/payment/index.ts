import {PaymentMethodEnum} from '@const/payment';

export interface PaymentMethodModel {
  id: string;
  type: PaymentMethodEnum;
  note?: string;
  settings: any;
  default?: boolean;
  qrCodeUrl?: string;
}

export interface CreatePaymentMethodModel {
  type: PaymentMethodEnum;
  note?: string;
  settings: any;
  qrCodeUrl?: string;
}

export interface UpdatePaymentMethodModel extends CreatePaymentMethodModel {}

export interface CashMethodModel extends PaymentMethodModel {
  settings: {
    phoneNumber: string;
    wallet: string;
  };
}

export interface BankMethodModel extends PaymentMethodModel {
  settings: {
    bankAccountName: string;
    bankAccountNumber: string;
    bank: string;
  };
}

export interface EwalletMethodModel extends PaymentMethodModel {
  settings: {
    phoneNumber: string;
    wallet: string;
    walletAccountName: string;
  };
}

export interface BankInformationResponseModel {
  label: string;
  value: string;
  logo?: string;
}
