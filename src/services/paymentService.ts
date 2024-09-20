import { privateAxios } from '@libs/axios';
import {
  CreatePaymentMethodModel,
  PaymentMethodModel,
  UpdatePaymentMethodModel,
} from '@models/payment';
import { PaymentEndPointEnum } from '@const/payment';
import axios from 'axios';

export const getUserPaymentInfors = async () => {
  const res = await privateAxios.get(
    PaymentEndPointEnum.GET_USER_PAYMENT_INFORS
  );
  return res?.data as PaymentMethodModel[];
};

export const createUserPaymentInfors = async (
  payload: CreatePaymentMethodModel
) => {
  const res = await privateAxios.post(
    PaymentEndPointEnum.CREATE_PAYMENT_INFOR,
    payload
  );
  return res?.data as PaymentMethodModel;
};

export const deleteUserPaymentInfor = async (id: string) => {
  await privateAxios.delete(
    `${PaymentEndPointEnum.DELETE_USER_PAYMENT_INFOR}/${id}`
  );
};

export const editUserPaymentInfor = async (
  payload: UpdatePaymentMethodModel,
  id: string
) => {
  const res = await privateAxios.put(
    `${PaymentEndPointEnum.EDIT_USER_PAYMENT_INFOR}/${id}`,
    payload
  );
  return res?.data as PaymentMethodModel;
};

export const getAllBanks = async () => {
  //const filePath = '../utils/apiBanking.json';
  const res = await axios.get("https://api.vietqr.io/v2/banks");
  return res.data.data;
}

export const uploadPaymentQRCode = async (bodyFormData: any) => {
  const res = await privateAxios.post(
    PaymentEndPointEnum.UPLOAD_PAYMENT_QR_CODE,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return res.data as string;
};