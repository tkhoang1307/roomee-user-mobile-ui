import {ServiceUtilityEndPoints} from '@const/service';
import {privateAxios} from '@libs/axios';
import {
  ServiceAccommodationResponseModel,
  ServiceRoomResponseModel,
  UpdationServiceRoomRequestModel,
  ServiceCategoryModel,
} from '@models/service-utility';

export const getAllServicesCategory = async () => {
  const res = await privateAxios.get(
    ServiceUtilityEndPoints.GET_ALL_SERVICES_CATEGORY,
  );
  return res.data;
};

export const getServiceCategoryById = async (categoryId: string) => {
  const res = await privateAxios.get(
    ServiceUtilityEndPoints.GET_ALL_SERVICES_CATEGORY + '/' + categoryId,
  );
  return res.data as ServiceCategoryModel;
};

export const getAllServicesForAccommodation = async (
  accommodationId: string,
  serviceType: string,
) => {
  const res = await privateAxios.get(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ACCOMMODATION +
      '?accommodationId=' +
      accommodationId +
      '&serviceType=' +
      serviceType,
  );
  return res.data as Array<ServiceAccommodationResponseModel>;
};

export const createSecondaryServiceForAccommodation = async (payload: any) => {
  const res = await privateAxios.post(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ACCOMMODATION,
    {...payload},
  );
  return res.data as ServiceAccommodationResponseModel;
};

export const updateSecondaryServiceForAccommodation = async (payload: any) => {
  const res = await privateAxios.put(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ACCOMMODATION,
    {...payload},
  );
  return res.data;
};

export const deleteSecondaryServiceForAccommodation = async (
  accommodationId: string,
  accommodationServiceId: string,
) => {
  const res = await privateAxios.delete(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ACCOMMODATION +
      '?accommodationId=' +
      accommodationId +
      '&accommodationServiceId=' +
      accommodationServiceId,
  );
  return res;
};

export const getAllServicesForRoom = async (
  roomId: string,
  serviceType: string,
) => {
  const res = await privateAxios.get(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ROOM +
      '?roomId=' +
      roomId +
      '&serviceType=' +
      serviceType,
  );
  return res.data as Array<ServiceRoomResponseModel>;
};

export const createSecondaryServiceForRoom = async (payload: any) => {
  const res = await privateAxios.post(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ROOM,
    {...payload},
  );
  return res.data;
};

export const updateSecondaryServiceForRoom = async (
  payload: UpdationServiceRoomRequestModel,
) => {
  const res = await privateAxios.put(
    ServiceUtilityEndPoints.SECONDARY_SERVICE_FOR_ROOM,
    {...payload},
  );
  return res.data;
};
