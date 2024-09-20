import {AccommodationEndPoints} from '@const/accomodation';
import {privateAxios} from '@libs/axios';
import {
  AccommodationModel,
  ContractTemplateModel,
  CreateAccommodationPayloadModel,
  ReponseRegistrationTemplateModel,
  ServiceCategoryModel,
  UpdateAccommodationModel,
} from '@models/accommodation';

export const createAccommodation = async (
  payload: CreateAccommodationPayloadModel,
) => {
  const res = await privateAxios.post(
    AccommodationEndPoints.CREATE_ACCOMMODATION,
    {...payload},
  );
  const {serivces, ...accommodation} = res?.data;
  return accommodation as AccommodationModel;
};

export const getAllAccommodations = async () => {
  const res = await privateAxios.get(
    AccommodationEndPoints.GET_CURRENT_ACCOMMODATIONS,
  );
  return res?.data as Array<AccommodationModel>;
};

export const getDetailAccommodation = async (accommodationId: string) => {
  const res = await privateAxios.get(
    AccommodationEndPoints.GET_DETAIL_ACCOMMODATION + `/${accommodationId}`,
  );
  return res?.data as AccommodationModel;
};

export const deleteAccommodation = async (accommodationId: string) => {
  await privateAxios.delete(
    AccommodationEndPoints.DELETE_ACCOMMODATION + `/${accommodationId}`,
  );
  return;
};

export const updateAccommodation = async (
  payload: UpdateAccommodationModel,
  accommodationId: string,
) => {
  const res = await privateAxios.patch(
    AccommodationEndPoints.UPDATE_ACCOMMODATION + `/${accommodationId}`,
    {...payload},
  );
  return res?.data as AccommodationModel;
};

export const createManagerForAccommodation = async (
  accommodationId: string,
  managerId: string,
) => {
  const res = await privateAxios.post(
    AccommodationEndPoints.CREATE_ACCOMMODATION +
      `/${accommodationId}/manager` +
      `/${managerId}`,
  );
  return res?.data as {accommodationId: string; managerId: string};
};

export const getServiceCategories = async () => {
  const res = await privateAxios.get(
    AccommodationEndPoints.GET_SERVICE_CATEGORY,
  );
  return res?.data as ServiceCategoryModel[];
};

export const getAccommodationContractTemplates = async (id: string) => {
  const res = await privateAxios.get(`/api/accommodation/${id}/settings`, {
    params: {type: 'accommodation-contract-template'},
  });
  return res?.data as ContractTemplateModel[];
};

export const uploadTheme = async (
  bodyFormData: any,
  accommodationId: string,
) => {
  const res = await privateAxios.post(
    `${AccommodationEndPoints.UPDATE_ACCOMMODATION}/${accommodationId}/theme`,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  const {theme} = res.data as AccommodationModel;
  return theme;
};

export const getRegistrationTemplate = async (
  accommodationId: string,
  type: string,
) => {
  const res = await privateAxios.get(
    `/api/accommodation/${accommodationId}/settings`,
    {
      params: {type},
    },
  );
  return res?.data as ReponseRegistrationTemplateModel[];
};
