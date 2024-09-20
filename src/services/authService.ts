import {
  signinPayload,
  responseData,
  dataSignUp,
  TrackingIdResponse,
} from '@models/auth';
import {AuthEndPoints} from '@const/auth';
// import {publicAxios} from '../libs/axios';
// import {getNextExpiresTime} from '../utils/expiresTime';
import {privateAxios, publicAxios} from '@libs/axios';
import {getNextExpiresTime} from '@utils/expiresTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeStorage} from '@utils/storageUtil';

export const signin = async (payload: signinPayload) => {
  const res = await publicAxios.post(AuthEndPoints.SIGN_IN_ENDPOINT, {
    ...payload,
  });
  const {token, tracking} = res.data as responseData;
  await AsyncStorage.setItem(
    'trackingId',
    tracking ? tracking.trackingId || '' : '',
  );
  return {
    ...res.data,
    token: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresTime: getNextExpiresTime(token.expiresIn),
    },
  };
};

export const signup = async (dataSignUp: dataSignUp) => {
  const res = await publicAxios.post(
    AuthEndPoints.SIGN_UP_ENDPOINT,
    dataSignUp,
  );
  const {token, tracking} = res.data as responseData;
  await AsyncStorage.setItem(
    'trackingId',
    tracking ? tracking.trackingId || '' : '',
  );
  return {
    ...res.data,
    token: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresTime: getNextExpiresTime(token.expiresIn),
    },
  };
};

export const forgotPassword = async (username: string) => {
  const res = await publicAxios.post(AuthEndPoints.FORGOT_PASSWORD, {
    username,
  });
  const {trackingId} = res.data as {trackingId: string};
  await AsyncStorage.setItem('trackingId', trackingId);
};

export const verifyCodeForgotPassword = async (
  email: string,
  verifyCode: number,
) => {
  const trackingIdStorage = await AsyncStorage.getItem('trackingId');
  const res = await publicAxios.post(
    AuthEndPoints.VERIFY_CODE_FORGOT_PASSWORD,
    {
      email,
      verifyCode,
    },
    {
      headers: {
        'tracking-id': trackingIdStorage || '',
      },
    },
  );
  await AsyncStorage.removeItem('trackingId');
  const {trackingId} = res.data as {trackingId: string};
  await AsyncStorage.setItem('trackingId', trackingId);
};

export const renewForgotPassword = async (password: string) => {
  const trackingIdStorage = await AsyncStorage.getItem('trackingId');
  await publicAxios.put(
    AuthEndPoints.UPDATE_PASSWORD,
    {
      password,
    },
    {
      headers: {
        'tracking-id': trackingIdStorage || '',
      },
    },
  );
  await removeStorage('trackingId');
};

export const verifyEmail = async (verifyCode: number) => {
  const trackingIdStorage = await AsyncStorage.getItem('trackingId');
  const res = await privateAxios.put(
    AuthEndPoints.VERIFY_EMAIL_ENDPOINT,
    {
      verifyCode,
    },
    {
      headers: {
        'tracking-id': trackingIdStorage || '',
      },
    },
  );
  await AsyncStorage.removeItem('trackingId');
  const {token, tracking} = res.data as responseData;
  await AsyncStorage.setItem(
    'trackingId',
    tracking ? tracking.trackingId || '' : '',
  );
  return {
    ...res.data,
    token: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresTime: getNextExpiresTime(token.expiresIn),
    },
  };
};

export const sendVerifyEmail = async () => {
  const res = await privateAxios.post(AuthEndPoints.SEND_VERIFY_EMAIL_ENDPOINT);
  const {trackingId} = res.data as TrackingIdResponse;
  await AsyncStorage.setItem('trackingId', trackingId);
};

export const resendVerifyEmail = async () => {
  const trackingIdStorage = await AsyncStorage.getItem('trackingId');
  const res = await privateAxios.post(
    AuthEndPoints.RESEND_VERIFY_EMAIL_ENDPOINT,
    {},
    {
      headers: {
        'tracking-id': trackingIdStorage || '',
      },
    },
  );
  const {trackingId} = res.data as TrackingIdResponse;
  await AsyncStorage.setItem('trackingId', trackingId);
};

export const signinByGoogle = async (payload: {accessToken: string}) => {
  const res = await publicAxios.post(AuthEndPoints.SIGN_IN_BY_GOOGLE_ENDPOINT, {
    ...payload,
  });
  const {token} = res.data as responseData;
  return {
    ...res.data,
    token: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresTime: getNextExpiresTime(token.expiresIn),
    },
  };
};

export const signupByGoogle = async (payload: {
  accessToken: string;
  role: string;
}) => {
  const res = await publicAxios.post(AuthEndPoints.SIGN_UP_BY_GOOGLE_ENDPOINT, {
    ...payload,
  });
  const {token} = res.data as responseData;
  return {
    ...res.data,
    token: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresTime: getNextExpiresTime(token.expiresIn),
    },
  };
};
