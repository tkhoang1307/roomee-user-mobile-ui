import {AccommodationEndPoints} from '@const/accomodation';
import {RoomPropertyEndpoints} from '@const/property';
import {RoomEndPoints} from '@const/room';
import {privateAxios} from '@libs/axios';
import {AccomRoomModel} from '@models/accommodation';
import {
  CreateRoomPayloadModel,
  DataCreateReturnModel,
  RoomPropertyModel,
  RoomPropertyPayloadModel,
  RoomPropertyUpdateModel,
  UpdateRoomModel,
} from '@models/room';
import {TenantModel} from '@models/tenant';

export const getAllRoomAccomodation = async (accommodationId: string) => {
  const res = await privateAxios.get<Array<AccomRoomModel>>(
    RoomEndPoints.GET_DETAIL_ROOM + `?accommodationId=${accommodationId}`,
  );
  return res?.data;
};

export const getDetailRoom = async (roomId: string) => {
  const res = await privateAxios.get(
    RoomEndPoints.GET_DETAIL_ROOM + `/${roomId}`,
  );
  return res?.data as AccomRoomModel;
};

export const deleteRoom = async (roomId: string) => {
  await privateAxios.delete(RoomEndPoints.DELETE_ROOM + `/${roomId}`);
};

export const getFloorAndNameOfAccommodation = async (
  acccommodationId: string,
) => {
  const res = await privateAxios.get(
    AccommodationEndPoints.GET_ALL_ROOM_ACCOMODATION + `/${acccommodationId}`,
  );
  const {floorNumber, name} = res?.data;
  return {floorNumber, name} as {floorNumber: number; name: string};
};

export const updateGeneralInforRoom = async (
  payload: UpdateRoomModel,
  roomId: string,
) => {
  const res = await privateAxios.patch(
    RoomEndPoints.UPDATE_ROOM + `/${roomId}`,
    {...payload},
  );
  return res?.data as UpdateRoomModel;
};

export const createNewRoom = async (payload: CreateRoomPayloadModel) => {
  const res = await privateAxios.post(RoomEndPoints.CREATE_ROOM, {
    ...payload,
  });
  return res?.data as DataCreateReturnModel;
};

export const pushRoomImage = async (bodyFormData: any, roomId: string) => {
  const res = await privateAxios.post(
    `/api/room/${roomId}/image`,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res?.data;
};

export const getDataFromIdCard = async (bodyFormData: any, roomId: string) => {
  const res = await privateAxios.put(
    `/api/room/${roomId}/tenant/identity-card`,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res?.data;
};

export const createRoomProperty = async (payload: RoomPropertyPayloadModel) => {
  const res = await privateAxios.post(
    RoomPropertyEndpoints.CREATE_ROOM_PROPERTY,
    {...payload},
  );
  return res?.data;
};

export const getAllRoomProperties = async (roomId: string) => {
  const res = await privateAxios.get(
    RoomPropertyEndpoints.GET_ALL_ROOM_PROPERTY + `/${roomId}`,
  );
  return res?.data as RoomPropertyModel[];
};

export const deleteRoomProperty = async (
  propertyId: string,
  roomId: string,
) => {
  await privateAxios.delete(
    RoomPropertyEndpoints.DELETE_ROOM_PROPERTY +
      `/${propertyId}/room` +
      `/${roomId}`,
  );
};

export const updateRoomProperty = async (
  propertyId: string,
  roomId: string,
  payload: RoomPropertyUpdateModel,
) => {
  const res = await privateAxios.put(
    RoomPropertyEndpoints.UPDATE_ROOM_PROPERTY +
      `/${propertyId}/room` +
      `/${roomId}`,
    {...payload},
  );
  return res?.data as RoomPropertyModel;
};

export const updateTenantRegistration = async (
  roomId: string,
  tenantId: string,
  startDate: string,
  endDate: string,
) => {
  const res = await privateAxios.put(
    RoomEndPoints.UPDATE_REGISTRATION_TENANT +
      `/${roomId}/tenant` +
      `/${tenantId}/registration`,
    {
      temporaryResidenceRegistrationStartDate: startDate,
      temporaryResidenceRegistrationEndDate: endDate,
    },
  );
  return res?.data;
};

export const getAllTenantsOfRoom = async (roomId: string) => {
  const res = await privateAxios.get('/api/room' + `/${roomId}/tenant`);
  return res?.data as TenantModel[];
};
