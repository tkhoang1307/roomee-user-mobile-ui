import {UserDetailModel} from '@models/user';

export type signinPayload = {
  username: string;
  password: string;
};

export type dataSignUp = {
  username: string;
  phoneNumber: string;
  name: string;
  password: string;
  role: string;
};

export type dataSignUpManager = {
  username: string;
  name: string;
  password: string;
  role: string;
};

export interface responseData {
  token: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  user: UserDetailModel;
  tracking?: {
    trackingId: string;
  };
  device: {
    deviceId: string;
    deviceName: string;
  };
}

export interface AuthState {
  token: {
    accessToken: string;
    refreshToken: string;
    expiresTime: string;
  };
  device: {
    deviceName?: string;
    deviceId?: string;
  };
}

export interface VerifyEmailPayload {
  verifyCode: number;
}

export interface TrackingIdResponse {
  trackingId: string;
}

export interface ValueFormSignUpModel {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface ErrorsMessageModel {
  phoneNumber: string;
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface ValueFormRenewPasswordModel {
  password: string;
  confirmPassword: string;
}

export type ErrorsRenewPassword = Pick<
  ErrorsMessageModel,
  'password' | 'confirmPassword'
>;
