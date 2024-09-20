import {RequestEndPoints} from '@const/request';
import {privateAxios} from '@libs/axios';
import {RequestModel} from '@models/request';

interface CreateServiceOtherRequestPayload {
  description: string;
}

interface CreateServiceRegistrationRequestPayload {
  description: string;
  accommodationServiceIds: string[];
}

interface CreateServiceRoomRepairRequestPayload {
  description: string;
  expense: number;
  roomProperties: string[];
}

export const getRequests = async ({
  cursor,
  type,
  status,
  accommodationId,
  roomId,
}: {
  cursor?: string;
  type?: string;
  status?: string;
  roomId?: string;
  accommodationId: string;
}) => {
  const requests = await privateAxios.get<RequestModel[]>(
    RequestEndPoints.GET_REQUESTS,
    {params: {cursor, type, status, roomId, accommodationId}},
  );

  return requests.data;
};

export const getRequestDetail = async ({topicId}: {topicId: string}) => {
  const request = await privateAxios.get<RequestModel>(
    `${RequestEndPoints.GET_REQUESTS}/${topicId}`,
  );

  return request.data;
};

export const createServiceRegistrationRequest = async ({
  payload,
  roomId,
}: {
  roomId: string;
  payload: CreateServiceRegistrationRequestPayload;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_SERVICE_REGISTRATION_REQUEST,
    {roomId, ...payload},
  );

  return requests.data;
};

export const createServiceRoomRepairRequest = async ({
  payload,
  roomId,
}: {
  roomId: string;
  payload: CreateServiceRoomRepairRequestPayload;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_ROOM_REPAIR_REQUEST,
    {roomId, ...payload},
  );

  return requests.data;
};

export const updateRequestAttachment = async ({
  payload,
  topicId,
}: {
  topicId: string;
  payload: CreateServiceRoomRepairRequestPayload;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_REQUEST_ATTACHMENT,
    {topicId, ...payload},
  );

  return requests.data;
};

export const updateCommentAttachment = async ({
  payload,
  commentId,
}: {
  commentId: string;
  payload: CreateServiceRoomRepairRequestPayload;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_COMMENT_ATTACHMENT,
    {commentId, ...payload},
  );

  return requests.data;
};
export const createServiceOtherRequest = async ({
  payload,
  roomId,
}: {
  roomId: string;
  payload: CreateServiceOtherRequestPayload;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_OTHER_REQUEST,
    {roomId, ...payload},
  );

  return requests.data;
};

export const updateRequestStatus = async ({
  payload,
  topicId,
}: {
  topicId: string;
  payload: {status: string};
}) => {
  const requests = await privateAxios.put<RequestModel>(
    RequestEndPoints.UPDATE_REQUEST_STATUS,
    {topicId, ...payload},
  );

  return requests.data;
};

export const updateRequestDescription = async ({
  payload,
  topicId,
}: {
  topicId: string;
  payload: {description: string};
}) => {
  const requests = await privateAxios.put<RequestModel>(
    RequestEndPoints.UPDATE_REQUEST_DESCRIPTION,
    {topicId, ...payload},
  );

  return requests.data;
};

export const updateRequestMetadata = async ({
  payload,
  topicId,
}: {
  topicId: string;
  payload: {meta: Record<string, any>};
}) => {
  const requests = await privateAxios.put<RequestModel>(
    RequestEndPoints.UPDATE_REQUEST_METADATA,
    {topicId, ...payload},
  );

  return requests.data;
};

export const createRequestAttachments = async ({
  payload,
  topicId,
}: {
  topicId: string;
  payload: FormData;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_REQUEST_ATTACHMENT.replace(':topic', topicId),
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return requests.data;
};

export const createCommentAttachments = async ({
  payload,
  commentId,
}: {
  commentId: string;
  payload: FormData;
}) => {
  const requests = await privateAxios.post<RequestModel>(
    RequestEndPoints.CREATE_COMMENT_ATTACHMENT.replace(':commentId', commentId),
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return requests.data;
};
