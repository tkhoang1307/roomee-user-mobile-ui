import {CreateTenantInputControl} from '@models/tenant';

export const DefaultTenantInput: CreateTenantInputControl = {
  type: undefined,
  name: '',
  email: '',
  phoneNumber: '',
  identityCardNumber: '',
  gender: undefined,
  placeOfOrigin: '',
  placeOfResidence: '',
  birthday: undefined,
  country: '',
  expiredTime: '',
  imageUrlBehind: '',
  imageUrlFront: '',
};

export enum TenantEndPoints {
  CREATE_TENANT = '/api/room',
  GET_ALL_TENANTS_OF_ACCOMMODATION = '/api/tenant/accommodation/',
  INVITE_TENANT_BY_TOKEN = '/api/room/invite',
}
