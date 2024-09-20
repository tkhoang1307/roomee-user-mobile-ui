import {RoomModel} from '@models/contract';

export interface TenantInformationModel {
  key?: string;
  id: string;
  name: string;
  dateOfBirth: string;
  placeOfOrigin: string;
  email: string;
  phoneNumber: string;
  identityCards?: IdentityCardModel[];
  updatedAt: string;
  userId: string;
  rooms: RoomModel[];
  temporaryResidenceRegistrationStartDate?: string;
  temporaryResidenceRegistrationEndDate?: string;
}

export interface CreateTenantInputControl {
  type: string | undefined;
  name: string;
  email: string;
  phoneNumber: string;
  identityCardNumber: string;
  gender: string | undefined;
  placeOfOrigin: string;
  placeOfResidence: string;
  birthday: any;
  country: string;
  expiredTime: string;
  imageUrlFront: string;
  imageUrlBehind: string;
}

export interface TenantTokenModel {
  accommodationId: string;
  roomId: string;
  contractId: string;
  tenantId: string;
  state: string;
}

export interface ArrayTenantsModel {
  data: {
    tenants: Array<TenantInformationModel>;
  };
  totalPage: number;
  current: number;
}

export interface idCardPayloadModel {
  identityCardNumber: string;
  type: string;
  name: string;
  gender: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  birthday: Date;
  country: string;
  expiredTime: string;
  imageUrlFront: string;
  imageUrlBehind: string;
}

export interface CreateTenantModel {
  email?: string;
  phoneNumber: string;
  contractId: string;
  isRoomLeader: boolean;
  identityCards: idCardPayloadModel[];
}

export interface CreateTenantRes {
  contractId: string;
  tenantId: string;
  roomId: string;
  state: string;
}

export interface InviteTenantPayload {
  phoneNumber: string;
  email: string;
}

export interface TenantFormInputModel {
  name: string;
  email: '';
  phoneNumber: string;
  identityCardNumber: string;
  gender: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  birthday: Date;
  country: string;
  expiredTime: string;
  imageUrlFront: string;
  imageUrlBehind: string;
  type: string;
}

export interface IdentityCardModel {
  id: string;
  imageUrlFront: string;
  imageUrlBehind: string;
  identityCardNumber: string;
  type: string;
  name: string;
  gender: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  birthday: Date;
  country: string;
  expiredTime: string;
  isLatestIdentityCard: boolean;
}

export interface CreateIdentityCardModel {
  identityCardNumber: string;
  type: string;
  name: string;
  gender: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  birthday: Date;
  country: string;
  expiredTime: string;
  imageUrlFront: string;
  imageUrlBehind: string;
}

export interface TenantModel {
  state: string;
  id: string;
  email?: string;
  phoneNumber: string;
  isRoomLeader: boolean;
  identityCards: IdentityCardModel[];
  temporaryResidenceRegistrationStartDate?: string;
  temporaryResidenceRegistrationEndDate?: string;
}

export interface TenantCardInformationModel {
  key?: string;
  id: string;
  name: string;
  dateOfBirth: string;
  placeOfOrigin: string;
  email: string;
  phoneNumber: string;
  gender: string;
  updatedAt: string;
  userId: string;
  roomName: string;
  temporaryResidenceRegistrationStartDate?: string;
  temporaryResidenceRegistrationEndDate?: string;
}
