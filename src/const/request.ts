export enum RequestEndPoints {
  GET_REQUESTS = '/api/request/topic',
  CREATE_SERVICE_REGISTRATION_REQUEST = '/api/request/topic/service',
  CREATE_ROOM_REPAIR_REQUEST = '/api/request/topic/roomRepair',
  CREATE_OTHER_REQUEST = '/api/request/topic/other',
  UPDATE_REQUEST_STATUS = '/api/request/topic/status',
  CREATE_REQUEST_ATTACHMENT = '/api/request/topic/:topic/attachment',
  UPDATE_REQUEST_DESCRIPTION = '/api/request/topic/description',
  UPDATE_REQUEST_METADATA = '/api/request/topic/meta',
  CREATE_COMMENT_ATTACHMENT = '/api/request/comment/:commentId/attachment',
}

export const MAX_REQUEST_DESCRIPTION_CHARS = 97;

export enum RequestsActionEnum {
  SET_REQUESTS = 'Set requests',
}
