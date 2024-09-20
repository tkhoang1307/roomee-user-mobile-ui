import {privateAxios} from '@libs/axios';
import {TenantEndPoints} from '@const/tenant';
import {
  CreateTenantModel,
  ArrayTenantsModel,
  TenantTokenModel,
  CreateTenantRes,
  InviteTenantPayload,
  TenantModel,
  CreateIdentityCardModel,
  IdentityCardModel,
} from '@models/tenant';

export const createTenants = async (
  payload: CreateTenantModel[],
  roomId: string,
) => {
  const res = await privateAxios.put(
    TenantEndPoints.CREATE_TENANT + `/${roomId}/tenant/batch`,
    payload,
  );
  return res?.data;
};

export const getAllTenantsOfAccommodation = async (
  accommodationId: string,
  page: number,
) => {
  const res = await privateAxios.get(
    TenantEndPoints.GET_ALL_TENANTS_OF_ACCOMMODATION + accommodationId,
    {
      params: {
        take: 10,
        skip: (page - 1) * 10,
      },
    },
  );
  return res.data as ArrayTenantsModel;
};

export const inviteTenatByToken = async (token: string) => {
  const res = await privateAxios.post<TenantTokenModel>(
    `${TenantEndPoints.INVITE_TENANT_BY_TOKEN}`,
    {
      token,
    },
  );
  return res.data;
};

export const createTenant = async (
  payload: CreateTenantModel,
  roomId: string,
) => {
  const res = await privateAxios.post(
    TenantEndPoints.CREATE_TENANT + `/${roomId}/tenant`,
    payload,
  );
  return res?.data as CreateTenantRes;
};

export const deleteTenant = async (tenantId: string, roomId: string) => {
  const res = await privateAxios.delete(
    TenantEndPoints.CREATE_TENANT + `/${roomId}/tenant`,
    {
      data: {
        tenantIds: [tenantId],
      },
    },
  );
  return res?.data;
};

export const updateTenant = async (
  payload: InviteTenantPayload,
  roomId: string,
  tenantId: string,
) => {
  const res = await privateAxios.put(
    TenantEndPoints.CREATE_TENANT + `/${roomId}/tenant/${tenantId}`,
    payload,
  );
  return res?.data as TenantModel;
};

export const createTenantIdCard = async (
  payload: CreateIdentityCardModel,
  roomId: string,
  tenantId: string,
) => {
  const res = await privateAxios.post(
    TenantEndPoints.CREATE_TENANT +
      `/${roomId}/tenant/${tenantId}/identity-card`,
    payload,
  );
  return res?.data as IdentityCardModel;
};

export const updateTenantPhoneNumber = async (
  phoneNumber: string,
  roomId: string,
  tenantId: string,
) => {
  const res = await privateAxios.put(
    TenantEndPoints.CREATE_TENANT +
      `/${roomId}/tenant/${tenantId}/phone-number`,
    {phoneNumber},
  );
  return res?.data as TenantModel;
};

export const updateTenantEmail = async (
  email: string,
  roomId: string,
  tenantId: string,
) => {
  const res = await privateAxios.put(
    TenantEndPoints.CREATE_TENANT + `/${roomId}/tenant/${tenantId}/email`,
    {email},
  );
  return res?.data as TenantModel;
};

export const updateTenantLeader = async (roomId: string, tenantId: string) => {
  const res = await privateAxios.put(
    TenantEndPoints.CREATE_TENANT + `/${roomId}/tenant/${tenantId}/room-leader`,
    {},
  );
  return res?.data as TenantModel;
};
