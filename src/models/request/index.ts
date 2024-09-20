export enum RequestType {
  ROOM_REPAIR = 'ROOM_REPAIR',
  SERVICE = 'SERVICE',
  OTHERS = 'OTHERS',
}

export enum RequestStatus {
  CREATED = 'CREATED',
  AWAITING_BOOKING = 'AWAITING_BOOKING',
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface RequestModel {
  modifiedBy: string;
  meta: Record<string, any>;
  description: string;
  attachments: string[];
  roomId: string;
  accommodationId: string;
  contractId: string;
  status: RequestStatus;
  type: RequestType;
  createdAt: string;
  creatorId: string;
  id: string;
  theme: string;
  creator?: {
    name: string;
    id: string;
    avatar: string;
  };
}

export interface CommentModel {
  topicId: string;
  avatar: string;
  name: string;
  createdAt: string;
  comment: string;
  commenterId: string;
  attachments: string[];
}

export interface DetailRequestModel {
  request: RequestModel;
  comments: CommentModel[];
}
