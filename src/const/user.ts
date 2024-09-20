import {CreateIdentityCardModel} from '@models/tenant';

export const EDIT_PROFILE = 'Edit profile';
export const LOG_OUT = 'Log out';
export const VERIFY_EMAIL = 'Verify email';
export const CODE_LENGTH = 4;
export const COUNTING_TIME = 60;
export const PAGE_SIZE = 6;

export enum UserEndPoints {
  UPLOAD_AVATAR = 'api/user/avatar',
  UPLOAD_INFOR = 'api/user',
  GET_USER = 'api/user',
  VERIFY_EMAIL_ENDPOINT = 'api/user/verify-email',
  SEND_VERIFY_EMAIL_ENDPOINT = 'api/user/send-verify-email',
  RESEND_VERIFY_EMAIL_ENDPOINT = 'api/user/resend-verify-email',
  OCR_OWNER_ID_CARD = '/api/owner/identity-card/ocr',
  OWNER_ID_CARD = '/api/owner/identity-card',
}

export enum UserRoles {
  TENANT = 'TENANT',
  MANAGER = 'MANAGER',
  OWNER = 'OWNER',
}

export enum Gender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  OTHER = 'Other',
}

export enum TypeOfIdCard {
  OLD_ID_CARD = 'CMND',
  NEW_ID_CARD = 'CCCD',
  DRIVING_LICENSE = 'GPLX',
}

export const DefaultIdCardInput: CreateIdentityCardModel = {
  identityCardNumber: '',
  type: '',
  name: '',
  gender: '',
  placeOfOrigin: '',
  placeOfResidence: '',
  birthday: new Date(),
  country: '',
  expiredTime: '',
  imageUrlFront: '',
  imageUrlBehind: '',
};
