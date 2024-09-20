import {NotificationEnum} from '@const/notification';
import {privateAxios} from '@libs/axios';
import {
  MarkAsReadNotificationPayload,
  NotificationModel,
} from '@models/notification';

export const getNotifications = async (
  cursor: string = '',
  event: string = '',
) => {
  const res = await privateAxios.get<NotificationModel[]>(
    `${NotificationEnum.GET}?cursor=${cursor}&event=${event.toUpperCase()}`,
  );
  return res.data;
};

export const registerNotification = async (token: string) => {
  const res = await privateAxios.post(NotificationEnum.REGISTER, {
    token,
  });
  return res.data;
};

export const markAsReadNotification = async (
  payload: MarkAsReadNotificationPayload[],
) => {
  const res = await privateAxios.post(NotificationEnum.MARK_AS_READ, {
    upsertNotifications: payload,
  });

  return res.data;
};
