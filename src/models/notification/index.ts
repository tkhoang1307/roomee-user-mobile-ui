import {NotificationType} from '@const/notification';

export interface MarkAsReadNotificationPayload {
  userNotificationId: string;
  isRead: boolean;
}

export interface NotificationModel {
  id: string;
  type: NotificationType;
  avatar: string;
  senderId: string;
  meta: Record<string, any>;
  redirectEndpoint: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  theme: string;
}

export interface NotificationPayload {
  data?: NotificationModel;
}

export interface NotificationStoreModel {
  event: NotificationModel[];
  topic: NotificationModel[];
  comment: NotificationModel[];
  loading: boolean;
}
