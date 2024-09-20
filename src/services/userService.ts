import AsyncStorage from '@react-native-async-storage/async-storage';

import {UserEndPoints} from '@const/user';
import {privateAxios} from '@libs/axios';
import {TrackingIdResponse, VerifyEmailPayload} from '@models/auth';
import {UserDetailModel} from '@models/user';
import {CreateIdentityCardModel, IdentityCardModel} from '@models/tenant';

export const uploadAvatar = async (bodyFormData: any) => {
  const res = await privateAxios.post(
    UserEndPoints.UPLOAD_AVATAR,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  const {imageUrl} = res.data as UserDetailModel;
  return {
    newImageUrl: imageUrl,
  };
};

export const uploadUserInfor = async (payload: any) => {
  const res = await privateAxios.post(UserEndPoints.UPLOAD_INFOR, {
    ...payload,
  });
  return res.data;
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const trackingIdStorage = await AsyncStorage.getItem('trackingId');
  const res = await privateAxios.put(
    UserEndPoints.VERIFY_EMAIL_ENDPOINT,
    payload,
    {
      headers: {
        'tracking-id': trackingIdStorage || '',
      },
    },
  );
  const {trackingId} = res.data as TrackingIdResponse;
  await AsyncStorage.setItem('trackingId', trackingId);
};

export const sendVerifyEmail = async () => {
  const res = await privateAxios.post(UserEndPoints.SEND_VERIFY_EMAIL_ENDPOINT);
  const {trackingId} = res.data as TrackingIdResponse;
  await AsyncStorage.setItem('trackingId', trackingId);
};

export const resendVerifyEmail = async () => {
  const trackingIdStorage = await AsyncStorage.getItem('trackingId');
  const res = await privateAxios.post(
    UserEndPoints.RESEND_VERIFY_EMAIL_ENDPOINT,
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

export const getDataFromIdCard = async (bodyFormData: any) => {
  const res = await privateAxios.put(
    UserEndPoints.OCR_OWNER_ID_CARD,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res?.data;
};

export const createOwnerIdCard = async (payload: CreateIdentityCardModel) => {
  const res = await privateAxios.post(UserEndPoints.OWNER_ID_CARD, payload);
  return res?.data as IdentityCardModel;
};

export const getOwnerIdCards = async () => {
  const res = await privateAxios.get(UserEndPoints.OWNER_ID_CARD);
  return res?.data as IdentityCardModel[];
};

export const deleteOwnerIdCard = async (cardId: string) => {
  const res = await privateAxios.delete(
    `${UserEndPoints.OWNER_ID_CARD}/${cardId}`,
  );
  return res?.data as IdentityCardModel;
};
