import {RequestModel} from '@models/request';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type NotificationStackParamList = {
  NotificationScreen: undefined;
  DetailRequestScreen: {
    topicId: string;
    request?: RequestModel;
    roomName?: string;
    accomName?: string;
  };
  DetailContractScreen: {
    contractId: string;
    roomId: string;
    roomName: string;
    accomId: string;
    accomName: string;
  };
  DetailInvoiceScreen: {
    invoiceId: string;
    roomId?: string;
    accommodationId?: string;
  };
  AddTenantScreen: {
    roomId: string;
    roomName: string;
    contractId: string;
  };
};

export type NotificationScreenProps = NativeStackScreenProps<
  NotificationStackParamList,
  'NotificationScreen'
>;
export type DetailRequestScreenProps = NativeStackScreenProps<
  NotificationStackParamList,
  'DetailRequestScreen'
>;
export type DetailContractScreenProps = NativeStackScreenProps<
  NotificationStackParamList,
  'DetailContractScreen'
>;
export type DetailInvoiceScreenProps = NativeStackScreenProps<
  NotificationStackParamList,
  'DetailInvoiceScreen'
>;
export type AddTenantScreenProps = NativeStackScreenProps<
  NotificationStackParamList,
  'AddTenantScreen'
>;
