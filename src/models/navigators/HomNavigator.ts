import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AccommodationModel} from '@models/accommodation';

import {RequestModel} from '@models/request';

export type RootStackParamList = {
  HomeScreen: undefined;
  DetailAccommodationScreen: {accommodationInfor: AccommodationModel};
  ChangeInfoAccommodationScreen: {
    accommodationInfor: AccommodationModel;
    isMainAccom: boolean;
  };
  AllRoomScreen: {accommodationID: string; accommodationName: string};
  AddRoomScreen: {floorNumber: number; accommodationID: string};
  ServiceAccommodationScreen: {accommodationID: string};
  ListRulesScreen: {accommodationID: string};
  DetailRoomScreen: {
    accommodationId: string;
    roomId: string;
    roomName: string;
    floor: number;
  };
  CreateContractScreen: {
    accommodationId: string;
    roomId: string;
    roomName: string;
    floor: number;
    rentalCost: number;
  };
  EditRoomScreen: {
    roomID: string;
  };
  ListTenantScreen: {
    accommodationID: string;
  };
  AddTenantScreen: {
    roomId: string;
    roomName: string;
    contractId: string;
  };
  AddTenantIdCardScreen: {
    roomId: string;
    tenantId: string;
  };
  RoomRequestsScreen: {
    roomId: string;
    roomName: string;
    accomId: string;
  };
  DetailRequestScreen: {
    topicId: string;
    request?: RequestModel;
    roomName?: string;
    accomName?: string;
  };
  ListInvoicesScreen: {
    roomId: string;
    contractId?: string;
    accommodationId: string;
  };
  ListInvoicesOfAccommodationScreen: {
    accommodationId: string;
    accom: AccommodationModel;
  };
  DetailInvoiceScreen: {
    invoiceId: string;
    roomId?: string;
    accommodationId?: string;
  };
  ServiceContractScreen: {
    roomId: string;
    accommodationId: string;
  };
  CreateInvoiceScreen: {
    roomId: string;
    accommodationId: string;
  };
  EditInvoiceScreen: {
    roomId: string;
    accommodationId: string;
    invoiceId: string;
  };
  ManageListPaymentMethodScreen: {
    accommodationId: string;
  };
  AddPaymentMethodScreen: {};
  ReportScreen: {
    accommodationId: string;
    accommodationName: string;
  };
  AccomRequestsScreen: {
    accom: AccommodationModel;
  };
  DetailContractScreen: {
    contractId: string;
    roomId: string;
    roomName: string;
    accomId: string;
    accomName: string;
  };
  AccomContractsScreen: {
    accomId: string;
  };
  ListManagerScreen: undefined;
  CreateManagerAccountScreen: undefined;
  AddAccommodationScreen: undefined;
  DetailMainAccommodationScreen: undefined;
  AddPropertyScreen: {
    roomId: string;
  };
  DetaiPropertyScreen: {
    roomId: string;
    propertyId: string;
  };
  AllPropertiesScreen: {
    roomId: string;
  };
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HomeScreen'
>;

export type DetailAccommodationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailAccommodationScreen'
>;

export type ChangeInfoAccommodationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChangeInfoAccommodationScreen'
>;

export type AllRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AllRoomScreen'
>;

export type AddRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddRoomScreen'
>;

export type ServiceAccommodationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ServiceAccommodationScreen'
>;

export type ListRulesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListRulesScreen'
>;
export type DetailRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailRoomScreen'
>;
export type CreateContractScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateContractScreen'
>;
export type EditRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditRoomScreen'
>;

export type ListTenantScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListTenantScreen'
>;
export type ListInvoicesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListInvoicesScreen'
>;
export type ListInvoicesOfAccommodationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListInvoicesOfAccommodationScreen'
>;
export type DetailInvoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailInvoiceScreen'
>;
export type ServiceContractScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ServiceContractScreen'
>;
export type CreateInvoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateInvoiceScreen'
>;
export type EditInvoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditInvoiceScreen'
>;
export type ManageListPaymentMethodScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ManageListPaymentMethodScreen'
>;
export type AddPaymentMethodScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddPaymentMethodScreen'
>;

export type ReportScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ReportScreen'
>;

export type AddTenantScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddTenantScreen'
>;

export type AddTenantIdCardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddTenantIdCardScreen'
>;

export type RoomRequestsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RoomRequestsScreen'
>;
export type DetailRequestScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailRequestScreen'
>;
export type AccomRequestsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AccomRequestsScreen'
>;
export type DetailContractScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailContractScreen'
>;
export type AccomContractsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AccomContractsScreen'
>;
export type ListManagerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListManagerScreen'
>;
export type CreateManagerAccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateManagerAccountScreen'
>;
export type AddAccomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddAccommodationScreen'
>;
export type DetailMainAccommodationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailMainAccommodationScreen'
>;
export type AddPropertyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddPropertyScreen'
>;
export type DetaiPropertyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetaiPropertyScreen'
>;
export type AllPropertiesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AllPropertiesScreen'
>;
